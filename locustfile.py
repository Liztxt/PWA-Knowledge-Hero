from locust import HttpUser, task, between

class KnowledgeHeroUser(HttpUser):
    wait_time = between(1, 2)
    host = "http://localhost:5000"

    @task
    def login(self):
        self.client.post("/api/auth/login", json={
            "username": "testuser",
            "password": "123456ju"
        })

    @task
    def home(self):
        self.client.get("/")