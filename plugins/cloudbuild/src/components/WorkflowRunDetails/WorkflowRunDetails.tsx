/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Entity } from '@backstage/catalog-model';
import { Link, WarningPanel } from '@backstage/core';
import {
  Breadcrumbs,
  LinearProgress,
  Link as MaterialLink,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import React from 'react';
import { useProjectName } from '../useProjectName';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { useWorkflowRunsDetails } from './useWorkflowRunsDetails';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(1),
  },
  accordionDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

export const WorkflowRunDetails = ({ entity }: { entity: Entity }) => {
  const { value: projectName, loading, error } = useProjectName(entity);
  const [projectId] = (projectName ?? '/').split('/');

  const details = useWorkflowRunsDetails(projectId);

  const serviceAccount = (details.value?.logUrl ?? '=').split('=');

  const classes = useStyles();
  if (error) {
    return (
      <WarningPanel title="Error:">
        Failed to load build, {error.message}.
      </WarningPanel>
    );
  } else if (loading) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="..">Workflow runs</Link>
        <Typography>Workflow run details</Typography>
      </Breadcrumbs>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.BRANCH_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.REPO_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.COMMIT_SHA}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <WorkflowRunStatus status={details.value?.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Service Account</Typography>
              </TableCell>
              <TableCell>
                {`${serviceAccount[1]}`}@cloudbuild.gserviceaccount.com
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details.value?.logUrl && (
                  <MaterialLink target="_blank" href={details.value.logUrl}>
                    Workflow runs on Google{' '}
                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </MaterialLink>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
