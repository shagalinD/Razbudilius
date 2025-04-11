from typing import Dict, Optional
from fastapi import HTTPException
from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
from typing import List
import os
import logging
import uuid

logger = logging.getLogger(__name__)

class QuestSession:
    def __init__(self, session_id: str, difficulty: str):
        self.session_id = session_id
        self.difficulty = difficulty
        self.steps: List[Messages] = []
        self.current_step = 0
        self.last_step = 4
        self.user_answers = []
        self.is_completed = False

class GigaChatManager:
    def __init__(self):
        self.sessions: Dict[str, QuestSession] = {}
        
        self.client = GigaChat(
            credentials=os.getenv("GIGACHAT_API_KEY"),
            scope="GIGACHAT_API_PERS",
            model="GigaChat",
            ca_bundle_file=r"C:\Games\russian_trusted_root_ca.cer",
        )
        self._update_token()

    def _update_token(self):
        try:
            self.client.get_token()
            logger.info("Token updated successfully")
        except Exception as e:
            logger.error(f"Token update failed: {str(e)}")
            raise

    def _generate_step(self, session: QuestSession) -> tuple[str, int]:
        check_reaction = f"""
            Имеется ли смысл в реакции пользователе на происходяющую в квесте ситуацию?

            Ответ только "да" или "нет"
        """

        end_quest = f"""
            Это последний шаг квеста. Заверши историю
        """

        try:
            messages=session.steps.copy()
            messages[-1] = Messages(
                role=MessagesRole.USER,
                content=session.steps[-1].content + check_reaction
            )
            response = self.client.chat(Chat(
                messages=messages
            ))
            text = response.choices[0].message.content
            if 'да' in text or not('нет' in text):
                if session.current_step >= session.last_step:
                    session.steps[-1].content += end_quest
                response = self.client.chat(Chat(
                    messages=session.steps
                ))
                text = response.choices[0].message.content
                session.current_step += 1
                return (text, session.current_step)
            else:
                return ("нет", session.current_step) 
        except Exception as e:
            return (e, session.current_step)

    def start_new_quest(self, difficulty: str) -> QuestSession:
        """Инициализация новой сессии квеста"""
        session_id = str(uuid.uuid4())
        session = QuestSession(session_id, difficulty)
        self._set_max_steps(difficulty=difficulty, session=session)
        
        # Генерация первого шага
        prompt = f"""
            Сгенерируй первый шаг текстого квеста: начни историю, которая затем будешь генерировать в зависимости от ответов пользователя.

            Требования: 
            - Не предлагай варианты действий для пользователя
            - Не предлагай додумывать историю, пользователь лишь говорит, что он делает
            - Ответь исключительно содержанием данного первого шага.
            - Сложность: {session.last_step} шагов
            """
        session.steps.append(Messages(
            role=MessagesRole.USER,
            content=prompt
        ))

        response = self.client.chat(Chat(
            messages=session.steps
        ))
        content = response.choices[0].message.content
        session.steps.append(Messages(
            role=MessagesRole.ASSISTANT,
            content=content,
        ))

        session.current_step = 1
        self.sessions[session_id] = session
        return session

    def process_answer(self, session_id: str, user_answer: str) -> Optional[str]:
        
        """Обработка ответа и генерация следующего шага"""
        session = self.sessions.get(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="session not found")
        
        if session.is_completed:
            return None
        
        # Сохраняем ответ
        session.steps.append(
            Messages(
                role=MessagesRole.USER,
                content=user_answer,
            )
        )
        
        # Генерация нового шага
        new_step, step = self._generate_step(session)
        
        session.steps.append(Messages(
            role=MessagesRole.ASSISTANT,
            content=new_step
        ))
        session.current_step = step
        
        return new_step

    def _set_max_steps(self, difficulty: str, session: QuestSession) -> int:
        """Определение количества шагов по уровню сложности"""
        last_step =  {
            "30s": 3,
            "1m": 6,
            "5m": 12
        }.get(difficulty, 3)
        session.last_step = last_step
