from llama_index.llms.ollama import Ollama
import json
from pydantic import BaseModel

class TagResponse(BaseModel):
    tags: list[str]

class ProductService:
    def __init__(self):
        self.llm = Ollama(
            model="mistral:7b",
            request_timeout=100,
            context_window=8000,
            system_prompt="You should give tags for a product. The tags should be in the same language as product name and description. You should limit tags to 10. Format should be a list of strings"
        )
        self.sllm = self.llm.as_structured_llm(TagResponse)


    def suggest_tags(self, name: str, description: str):
        res = self.sllm.complete(f"Suggest tags for the following product: {name} {description}")

        return json.loads(res.text)