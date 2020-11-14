# Container image that runs your code
FROM node

COPY . /

RUN npm i --prefix /

ENTRYPOINT ["node", "/index.py", ${INPUT_TOKEN}]
