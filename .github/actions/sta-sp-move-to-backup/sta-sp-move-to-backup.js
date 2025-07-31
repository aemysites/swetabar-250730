/*
 * Copyright 2025 Adobe. All rights reserved.
 * Licensed under the Apache License, Version 2.0.
 */
import core from '@actions/core';

const GRAPH_API = 'https://graph.microsoft.com/v1.0';

async function graphFetch(token, endpoint, options = {}) {
  const res = await fetch(`${GRAPH_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    core.warning(`Graph API error ${res.status}: ${errorText}`);
    throw new Error(`Graph API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

async function listFolderItems(token, driveId, folderId) {
  const data = await graphFetch(token, `/drives/${driveId}/items/${folderId}/children`);
  return data.value || [];
}

async function createBackupFolder(token, driveId, parentFolderId) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `backup-${timestamp}`;
  const body = JSON.stringify({ name: backupName, folder: {}, '@microsoft.graph.conflictBehavior': 'rename' });
  const data = await graphFetch(token, `/drives/${driveId}/items/${parentFolderId}/children`, { method: 'POST', body });
  return { id: data.id, name: backupName };
}

async function moveItem(token, driveId, itemId, destFolderId) {
  const body = JSON.stringify({ parentReference: { id: destFolderId } });
  await graphFetch(token, `/drives/${driveId}/items/${itemId}`, { method: 'PATCH', body });
}

export async function run() {
  try {
    const token = core.getInput('token');
    const spHost = core.getInput('sp_host');
    const spSitePath = core.getInput('sp_site_path');
    const spFolderPath = core.getInput('sp_folder_path');
    // 1. Get site ID
    const site = await graphFetch(token, `/sites/${spHost}:/sites/${spSitePath}`);
    const siteId = site.id;
    // 2. Get drive ID
    const drives = await graphFetch(token, `/sites/${siteId}/drives`);
    const rootDrive = spFolderPath.split('/').shift();
    let driveId = drives.value.find((dr) => dr.name === rootDrive)?.id;
    if (!driveId && drives.value.length === 1) driveId = drives.value[0].id;
    if (!driveId) throw new Error('Drive ID not found');
    // 3. Get folder ID
    let folderId = 'root';
    if (spFolderPath && spFolderPath !== rootDrive) {
      const segments = spFolderPath.split('/').filter(Boolean);
      let currentId = 'root';
      for (let i = 1; i < segments.length; i++) {
        const seg = segments[i];
        const folder = await graphFetch(token, `/drives/${driveId}/items/${currentId}/children`);
        const found = folder.value.find((item) => item.name === seg && item.folder);
        if (!found) throw new Error(`Folder segment not found: ${seg}`);
        currentId = found.id;
      }
      folderId = currentId;
    }
    // 4. List items in folder
    const items = await listFolderItems(token, driveId, folderId);
    // 5. Create backup folder
    const backup = await createBackupFolder(token, driveId, folderId);
    // 6. Move items except 'tools' and 'block-collection'
    for (const item of items) {
      if (['tools', 'block-collection'].includes(item.name)) continue;
      await moveItem(token, driveId, item.id, backup.id);
      core.info(`Moved ${item.name} to ${backup.name}`);
    }
    core.setOutput('backup_folder_name', backup.name);
  } catch (error) {
    core.setFailed(error.message);
  }
}

await run(); 