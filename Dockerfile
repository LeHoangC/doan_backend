FROM node:20-slim

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV

RUN echo "NODE_ENV is set to $NODE_ENV"

RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
    else \
        npm install --only=production; \
    fi

COPY . .

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "npm", "start" ]
