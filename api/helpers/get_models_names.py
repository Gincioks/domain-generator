# get models names from models folder. Name is like name.Modelfile

import os

def get_models_names():
    models_names = [os.path.basename(f).split('.')[0] for f in os.listdir('models') if os.path.isfile(os.path.join('models', f))]
    return models_names