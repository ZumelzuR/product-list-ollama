from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service import ProductService
from fastapi import HTTPException
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
SECRET = os.getenv("SECRET")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
from fastapi import Request, Depends

async def jwt_middleware(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    token = auth_header.split(" ")[1]
    return verify_token(token)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

product_service = ProductService()

class ProductRequest(BaseModel):
    name: str
    description: str

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.post("/suggest-tags")
async def suggest_tags(request: ProductRequest, _token: str = Depends(jwt_middleware)):
    name = request.name
    description = request.description

    if not name or not description:
        return {"error": "Name and description are required"}

    return product_service.suggest_tags(name, description)

