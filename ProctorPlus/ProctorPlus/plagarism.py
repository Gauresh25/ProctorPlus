# detector/ai_detector.py

from transformers import pipeline
import logging

class AIDetector:
    def __init__(self, model_name="roberta-base-openai-detector"):
        self.detector = pipeline("text-classification", model=model_name)
        self.logger = logging.getLogger(__name__)

    def detect(self, text):
        """
        Detects whether the provided text is AI-generated or not.

        Parameters:
        - text (str): The text to check for AI generation.

        Returns:
        - dict: A dictionary with the label and confidence score.
        """
        # self.logger.info(f"Parsed exam data: {text,submission}")
        result = self.detector(text)
        return {
            "label": result[0]['label'],
            "confidence": result[0]['score']
        }
