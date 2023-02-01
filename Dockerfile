# Multi-stage build
FROM node:18-alpine3.15 AS builder

# working directory 설정
WORKDIR /app

COPY package*.json ./
COPY yarn.lock  ./

# 인스톨
RUN yarn --frozen-lockfile

# working directory로 소스 복사
COPY . .

# 빌드실행 -> /app/build 생성
RUN yarn build

####################################

# nginx 이미지를 사용
FROM nginx

WORKDIR /app

RUN rm -rf /etc/nginx/conf.d/*
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

# 80 포트 오픈
EXPOSE 80 443

# container 실행 시 자동으로 실행할 command. nginx 시작
CMD ["nginx", "-g", "daemon off;"]