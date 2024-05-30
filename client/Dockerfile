# FROM node:18-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install -g npm@10.2.4

# RUN npm install

# VOLUME [ "/app/node_modules" ]

# COPY . .

# # build production
# # RUN npm run build 

# CMD [ "npm", "run", "dev" ]

FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.3

COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]