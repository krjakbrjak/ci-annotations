# Container image that runs your code
FROM python:3.8.2

COPY index.py /index.py

ENTRYPOINT ["python3", "/index.py"]
