/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import core from '@actions/core';

const HLX_ADM_API = 'https://admin.hlx.page';

/**
 * Simple function to remove a path's final extension, if it exists.
 * @param {string} path
 * @returns {string}
 */
function removeExtension(path) {
  const lastSlash = path.lastIndexOf('/');
  const fileName = path.slice(lastSlash + 1);
  const dotIndex = fileName.lastIndexOf('.');

  if (dotIndex === -1) return path; // No extension
  return path.slice(0, lastSlash + 1) + fileName.slice(0, dotIndex);
}

/**
 * Delete preview for one path, relative to the endpoint (i.e. ${HLX_ADM_API}/preview/${owner}/${repo}/${branch}/)
 * @param {string} endpoint
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function deletePreviewOnPath(endpoint, path) {
  let deletePath = path;
  if (path.endsWith('.docx')) {
    deletePath = removeExtension(deletePath);
  } else if (path.endsWith('.xlsx')) {
    deletePath = `${removeExtension(deletePath)}.json`;
  }
  try {
    const resp = await fetch(`${endpoint}${deletePath}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-error',
      },
    });
    if (!resp.ok) {
      const xError = resp.headers.get('x-error');
      core.debug(`.delete operation failed on ${deletePath}: ${resp.status} : ${resp.statusText} : ${xError}`);
      if (resp.status === 415 || resp.status === 404) {
        const noExtPath = removeExtension(path);
        if (noExtPath !== path && noExtPath !== deletePath) {
          core.info(`❓ Failed with an "Unsupported Media" or 404 error. Retrying delete operation without an extension: ${noExtPath}`);
          return deletePreviewOnPath(endpoint, noExtPath);
        }
        core.warning(`❌ Delete operation failed on extensionless ${deletePath}: ${xError}`);
      } else if (resp.status === 423) {
        core.warning(`❌ Delete operation failed on ${deletePath}. The file appears locked. Is it being edited? (${xError})`);
      } else {
        core.warning(`❌ Delete operation failed on ${deletePath}: ${xError}`);
      }
      return false;
    }
    core.info(`✓ Delete operation successful on ${deletePath}`);
    return true;
  } catch (error) {
    core.warning(`❌ Delete operation call failed on ${deletePath}: ${error.message}`);
  }
  return false;
}

export async function run() {
  const context = core.getInput('context');
  const urlsInput = core.getInput('urls');
  const paths = urlsInput.split(',').map((url) => url.trim());

  const { project } = JSON.parse(context);
  const { owner, repo, branch = 'main' } = project;
  if (!owner || !repo || !branch) {
    core.setOutput('error_message', 'Invalid context format.');
    return;
  }

  const operationReport = {
    successes: 0,
    failures: 0,
    failureList: [],
  };

  core.debug(`URLs: ${urlsInput}`);

  try {
    const endpoint = `${HLX_ADM_API}/preview/${owner}/${repo}/${branch}`;
    for (const path of paths) {
      core.debug(`.Performing delete operation on path: ${HLX_ADM_API}/preview/${owner}/${repo}/${branch}${path}`);
      const successfullyDeleted = await deletePreviewOnPath(endpoint, path);
      if (successfullyDeleted) {
        operationReport.successes += 1;
      } else {
        operationReport.failures += 1;
        operationReport.failureList.push(path);
      }
    }
    core.setOutput('successes', operationReport.successes);
    core.setOutput('failures', operationReport.failures);
    if (operationReport.failures > 0) {
      core.warning(`❌ The paths that failed are: ${JSON.stringify(operationReport.failureList, undefined, 2)}`);
      core.setOutput('error_message', `❌ Error: Failed to delete preview for ${operationReport.failures} of ${paths.length} paths.`);
    }
  } catch (error) {
    core.warning(`❌ Error: ${error.message}`);
    core.setOutput('error_message', `❌ Error: Failed to delete preview for all of the paths.`);
  }
}

await run(); 