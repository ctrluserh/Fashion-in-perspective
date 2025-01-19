from flask import Flask, request, jsonify, send_file
from api_keys import cohere_api_key, hugface, api_key2, api_key3, api_key4, api_key5   
import cohere
from PIL import Image
from prompts import EXTRACT
from flask_cors import CORS


from huggingface_hub import InferenceClient
import threading

#client = InferenceClient("stabilityai/stable-diffusion-3.5-large", token=hugface)


app = Flask(__name__)
CORS(app)

# Initialize Cohere client
cohere_client = cohere.ClientV2(cohere_api_key)

@app.route('/')
def home():
    return "Welcome to the Flask server with Cohere!"

@app.route('/generate/<prompt>', methods=['GET'])
def generate_text(prompt):
    print(prompt)
    if not prompt:
        return "No prompt"

    response = cohere_client.chat(
        model="command-r-plus", 
        messages=[{"role": "user", "content": prompt}]
    )

    return jsonify({"response": response.message.content[0].text})

@app.route('/extract/<prompt>', methods=['GET'])
def extract(prompt):
    print(prompt)
    if not prompt:
        return "No prompt"
    
    todo = EXTRACT

    response = cohere_client.chat(
        model="command-r-plus", 
        messages=[{"role": "user", "content": EXTRACT + prompt}]
    )

    extracted_arr = response.message.content[0].text.split(",")
    extracted_arr = [x.strip() for x in extracted_arr]
    d = {}
    d["country"] = extracted_arr[0]
    d["fabric"] = dict()
    for i in range(1, len(extracted_arr), 2):
        d["fabric"][extracted_arr[i]] = int(extracted_arr[i+1])

    return jsonify(d)

@app.route('/factoryimage/<prompt>', methods=['GET'])
def factory_image(prompt):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=hugface)
    print(prompt)
    if not prompt:
        return "No prompt"
    
    
    
    # output is a PIL.Image object
    image = client.text_to_image( prompt)
    image.save("img.png", "PNG")

    # Return the image as part of the response
    return send_file("img.png", mimetype='image/png')

@app.route('/factoryimage2/<prompt>', methods=['GET'])
def factory_image2(prompt):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=api_key2)
    print(prompt)
    if not prompt:
        return "No prompt"
    
    
    
    # output is a PIL.Image object
    image = client.text_to_image( prompt)
    image.save("img2.png", "PNG")

    # Return the image as part of the response
    return send_file("img2.png", mimetype='image/png')

@app.route('/factoryimage3/<prompt>', methods=['GET'])
def factory_image3(prompt):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=api_key3)
    print(prompt)
    if not prompt:
        return "No prompt"
    
    
    
    # output is a PIL.Image object
    image = client.text_to_image( prompt)
    image.save("img3.png", "PNG")

    # Return the image as part of the response
    return send_file("img3.png", mimetype='image/png')

@app.route('/factoryimage4/<prompt>', methods=['GET'])
def factory_image4(prompt):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=api_key4)
    print(prompt)
    if not prompt:
        return "No prompt"
    
    
    
    # output is a PIL.Image object
    image = client.text_to_image( prompt)
    image.save("img4.png", "PNG")

    # Return the image as part of the response
    return send_file("img4.png", mimetype='image/png')

@app.route('/factoryimage5/<prompt>', methods=['GET'])
def factory_image5(prompt):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=api_key5)
    print(prompt)
    if not prompt:
        return "No prompt"
    
    
    
    # output is a PIL.Image object
    image = client.text_to_image( prompt)
    image.save("img5.png", "PNG")

    # Return the image as part of the response
    return send_file("img5.png", mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)