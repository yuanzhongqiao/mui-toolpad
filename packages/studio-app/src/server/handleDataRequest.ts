import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { execApi, loadDom, loadReleaseDom } from './data';
import initMiddleware from './initMiddleware';
import { NodeId, StudioApiResult } from '../types';
import * as studioDom from '../studioDom';

// Initialize the cors middleware
const cors = initMiddleware<any>(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    // TODO: make this configurable
    origin: '*',
  }),
);

export interface HandleDataRequestParams {
  appId: string;
  release: string | null;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<StudioApiResult<any>>,
  { appId, release }: HandleDataRequestParams,
) => {
  await cors(req, res);
  const apiNodeId = req.query.queryId as NodeId;
  const dom = release ? await loadReleaseDom(appId, release) : await loadDom(appId);
  const api = studioDom.getNode(dom, apiNodeId, 'api');
  res.json(
    await execApi(appId, api, req.query.params ? JSON.parse(req.query.params as string) : {}),
  );
};
