import tensorflow as tf
import csv
import os
import gdown
import platform

class deseaseModels:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(deseaseModels, cls).__new__(cls)
            cls._instance.init_singleton()
        return cls._instance

    def init_singleton(self):
        '''
            Init model
        '''
        if os.path.exists("/.dockerenv"):
            # when run by docker
            path = os.path.join(os.getcwd(), "src/datas/")
        else:
            # when run by local
            path = os.path.join(os.getcwd(), "datas/")
        self.labels = {}
        with open(path + 'images/names.csv', newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.labels[int(row['index'])] = row['name']
                # print(self.labels[int(row['index'])])
                # print(row['index'])
        # print(self.labels)
                
        file_id = '1XaP_oF_j8jeAW8r0aDtYi-9DNZ3htAKX'
        url = f'https://drive.google.com/uc?id={file_id}'
        file_name = 'models/model_weights.h5'
        if not os.path.exists(path+file_name):
            gdown.download(url, path+file_name, quiet=False)
        self.weightModel = tf.keras.models.load_model(path+file_name)
            
