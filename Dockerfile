From node:16.13.1

WORKDIR /backend/

COPY package*.json /backend/

RUN npm install

COPY . /backend/

EXPOSE 8001

CMD [ "npm", "run", "build" ]
CMD [ "npm", "run", "start" ]