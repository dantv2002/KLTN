FROM python:3.9-slim-bullseye

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ./src ./src

ENV FLASK_APP=src.app
CMD [ "flask", "run", "--host", "PythonAPI","--debug"]