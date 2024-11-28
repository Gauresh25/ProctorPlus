#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def pre_render():
    from transformers import AutoModel, AutoTokenizer
    
    # Specify the model name
    model_name = "roberta-base-openai-detector"
    # Download the model and tokenizer
    model = AutoModel.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    print(f"Model and tokenizer for '{model_name}' have been downloaded.")

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProctorPlus.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
