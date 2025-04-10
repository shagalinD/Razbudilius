from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gigachat_api import GigaChatManager
import logging
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestRequest(BaseModel):
    difficulty: str

class AnswerRequest(BaseModel):
    session_id: str
    user_answer: str

try:
    gc = GigaChatManager()
except Exception as e:
    logger.critical(f"Failed to initialize GigaChat: {str(e)}")
    raise

@app.get("/start_quest")
async def start_quest(dif: str = Query(..., alias="dif")):
    try:
        session = gc.start_new_quest(dif)
        return {
            "session_id": session.session_id,
            "content": session.steps[-1].content,
            "status": "in progress",
            "progress": f"{session.current_step}/{session.last_step}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process_answer")
async def process_answer(request: AnswerRequest):
    try:
        session = gc.sessions.get(request.session_id)

        # Получение следующего шага
        next_step = gc.process_answer(request.session_id, request.user_answer)
        
        if session.current_step < session.last_step:
            if (next_step == 'нет'):
                return {
                "content": "ответ не соответствует запросу, попробуйте еще раз",
                "progress": f"{session.current_step}/{session.last_step}",
                "status": "in progress",
            }
            
            return {
                "content": next_step,
                "progress": f"{session.current_step}/{session.last_step}",
                "status": "in progress",
            }
        else:
            return {
                "status": "completed",
                "progress": f"{session.current_step}/{session.last_step}",
                "content": next_step,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    
            

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)