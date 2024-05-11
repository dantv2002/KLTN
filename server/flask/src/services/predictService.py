import numpy as np
import os
import shutil
import tensorflow as tf
import json

class predictService:
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
        return json.dumps(name_result_map)
    
    def preprocessImage(self):
        cache_subdir = os.path.join(os.getcwd(), "caches/")
        print("cache dir: " + cache_subdir)
        image = tf.keras.preprocessing.image.load_img(tf.keras.utils.get_file(origin=self.imageURL, cache_subdir=cache_subdir), target_size=(300, 300), color_mode = "rgb")
         # Get original image dimensions
        original_height, original_width = image.height, image.width

        # Calculate resize ratio while preserving aspect ratio
        if original_height > original_width:
            resize_ratio = 224.0 / original_height
        else:
            resize_ratio = 224.0 / original_width

        # Resize image dimensions based on the calculated ratio
        new_height = int(original_height * resize_ratio)
        new_width = int(original_width * resize_ratio)

        # Resize the image using tf.image.resize()
        resized_image = tf.image.resize(
            image, (new_height, new_width), method=tf.image.ResizeMethod.NEAREST_NEIGHBOR  # Choose appropriate resize method
        )
        image_array = tf.keras.preprocessing.image.img_to_array(resized_image)
        image_array = np.expand_dims(image_array, axis=0)
        image_array = image_array / 255.0
        shutil.rmtree(cache_subdir)
        # print(image_array)
        return image_array