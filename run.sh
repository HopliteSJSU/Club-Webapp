#!/usr/bin/env bash
# install node modules & run the front end *then* install node modules & run the back end
cd frontend && npm run initial-start & cd backend && npm run initial-dev

