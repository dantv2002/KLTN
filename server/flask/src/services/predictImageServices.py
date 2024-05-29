import numpy as np
import os
import shutil
import tensorflow as tf

IMAGE_HEIGHT_INPUT, IMAGE_WIDTH_INPUT = 224, 224

class predictImageServices:
    def __init__(self, url, model):
        """
        Create a new predict service.

        Args:
            url: The image URL.
        """
        self.imageURL = url
        self.result = {}
        self.models = model
        
    def predict(self):
        """
        predict.

        Returns:
            The result.
        """
        image = self.preprocessImage()
        predictions = self.models.weightModel.predict(image)
        # print(predictions*100)
        # predicted_class = np.argmax(predictions)
        # print(predicted_class)
        # print(self.models.labels)
        for predict_class in self.models.labels:
            self.result[predict_class] = predictions[0][predict_class]*100
            # print(predict_class)
        name_result_map = {self.models.labels[key]: key for key in self.models.labels.keys()}
        # print(name_result_map)
        for name in name_result_map:
            name_result_map[name] = self.result[name_result_map[name]]
        # print(name_result_map)
        return name_result_map
    
    def preprocessImage(self):
        cache_subdir = os.path.join(os.getcwd(), "caches/")
        print("cache dir: " + cache_subdir)
        image = tf.keras.preprocessing.image.load_img(tf.keras.utils.get_file(origin=self.imageURL, cache_subdir=cache_subdir), target_size=None, color_mode = "rgb")
        image_arr = tf.keras.preprocessing.image.img_to_array(image)
        image_arr = np.expand_dims(image_arr, axis=0)

        preprocessed_image = self.resnetPreprocess(image_arr)
        preprocessed_image = preprocessed_image.numpy().astype("uint8")
        
        shutil.rmtree(cache_subdir)
        return preprocessed_image
    
    def resnetPreprocess(self, img, target_height=IMAGE_HEIGHT_INPUT, target_width=IMAGE_WIDTH_INPUT):
        img = tf.image.resize_with_pad(
        img, 
        target_height, target_width, 
        method=tf.image.ResizeMethod.NEAREST_NEIGHBOR,
        antialias=False
        )
        img = tf.keras.applications.resnet.preprocess_input(img)
        return img