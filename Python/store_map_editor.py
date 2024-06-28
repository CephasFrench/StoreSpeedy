import os
import cv2
import numpy as np
from PIL import Image, ImageTk
import tkinter as tk
from tkinter import simpledialog
import random
import atexit

# Define the image and text file paths
image_path = '/Users/cameronhardin/Desktop/StoreSpeedy/Valley Mills Waco Store Guide Cleared2 pdf.png'
array_file_path = '/Users/cameronhardin/Desktop/StoreSpeedy/vmstoretext.txt'
readable_file_path = '/Users/cameronhardin/Desktop/StoreSpeedy/vmstoretext_readable.txt'
legend_file_path = '/Users/cameronhardin/Desktop/StoreSpeedy/vmstoretext_legend.txt'

# Scale factor for enlarging each pixel
scale_factor = 2

# Check if the image file exists
if not os.path.exists(image_path):
    print(f"File not found: {image_path}")
    exit(1)

# Load the image
img = cv2.imread(image_path)
if img is None:
    print(f"Unable to read the image file: {image_path}")
    exit(1)

# Convert the image to grayscale
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Resize the image to a fixed height and width
height, width = 400, 600
img_resized = cv2.resize(img_gray, (width, height), interpolation=cv2.INTER_AREA)

# Define the range for white and off-white colors with a more stringent upper bound
lower_white = np.array([220], dtype=np.uint8)
upper_white = np.array([255], dtype=np.uint8)

# Create a mask for white and off-white colors
mask = cv2.inRange(img_resized, lower_white, upper_white)

# Invert the mask to get black areas
binary_img = cv2.bitwise_not(mask)

# Convert the binary image to a 2D array of lists of characters ('1' for black, '0' for white)
array_2d = [['1'] if binary_img[j, i] == 0 else ['0'] for j in range(height) for i in range(width)]
array_2d = np.reshape(array_2d, (height, width)).tolist()

# Load existing legend data if it exists
string_colors = {'0': (255, 255, 255), '1': (0, 0, 0)}  # Default colors for '0' and '1'
if os.path.exists(legend_file_path):
    with open(legend_file_path, 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if len(parts) == 4:
                string, r, g, b = parts[0], int(parts[1]), int(parts[2]), int(parts[3])
                string_colors[string] = (r, g, b)

if os.path.exists(array_file_path):
    with open(array_file_path, 'r') as f:
        for line in f:
            parts = line.strip().split(',')
            if len(parts) == 3:  # For simple coordinate and string
                x, y, string = int(parts[0]), int(parts[1]), parts[2]
                if 0 <= y < height and 0 <= x < width:
                    array_2d[y][x] = list(string)

# Save the 2D array to a text file
def save_array():
    with open(array_file_path, 'w') as f:
        for y in range(height):
            for x in range(width):
                try:
                    string = ''.join(array_2d[y][x])
                    f.write(f"{x},{y},{string}\n")
                except IndexError as e:
                    print(f"IndexError at ({x}, {y}): {e}")

# Save a more readable version of the 2D array
with open(readable_file_path, 'w') as f:
    for row in array_2d:
        f.write(' '.join([''.join(item) for item in row]) + '\n')

print(f"2D array saved to {array_file_path}")
print(f"Readable 2D array saved to {readable_file_path}")

# Save the legend to a text file
def save_legend():
    with open(legend_file_path, 'w') as f:
        for string, color in string_colors.items():
            f.write(f"{string},{color[0]},{color[1]},{color[2]}\n")

# Generate a random bright color
def generate_color():
    return tuple(random.randint(100, 255) for _ in range(3))

# Create an image from the 2D array
def array_to_image(array, scale_factor):
    height, width = len(array), len(array[0])
    scaled_height, scaled_width = height * scale_factor, width * scale_factor
    scaled_image = Image.new('RGB', (scaled_width, scaled_height))

    for i in range(width):
        for j in range(height):
            string = ''.join(array[j][i])
            if string not in string_colors:
                string_colors[string] = generate_color()
            color = string_colors[string]
            for di in range(scale_factor):
                for dj in range(scale_factor):
                    scaled_image.putpixel((i * scale_factor + di, j * scale_factor + dj), color)

    return scaled_image

# Create the initial scaled image
scaled_image = array_to_image(array_2d, scale_factor)

# GUI using tkinter
class StoreMapEditor(tk.Tk):
    def __init__(self, img, array, scale_factor):
        super().__init__()
        self.title("Store Map Editor")
        self.img = img
        self.array = array
        self.scale_factor = scale_factor

        # Ensure the window fits the entire image
        self.geometry(f"{scaled_image.width}x{scaled_image.height}")

        self.canvas = tk.Canvas(self, width=scaled_image.width, height=scaled_image.height)
        self.canvas.pack(side=tk.LEFT, expand=True, fill=tk.BOTH)

        self.photo_img = ImageTk.PhotoImage(scaled_image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.photo_img)

        self.canvas.bind("<Button-1>", self.on_click)

        self.protocol("WM_DELETE_WINDOW", self.on_closing)

        # Schedule periodic saving
        self.save_interval = 10000  # 10 seconds
        self.periodic_save()

        # Undo/redo stack
        self.undo_stack = []
        self.redo_stack = []

        # Create legend
        self.create_legend()

        # Ensure the window is not resizable
        self.resizable(False, False)

    def on_click(self, event):
        x, y = int(self.canvas.canvasx(event.x) // self.scale_factor), int(self.canvas.canvasy(event.y) // self.scale_factor)
        print(f"Clicked position: ({x}, {y})")
        if 0 <= x < width and 0 <= y < height:
            print(f"Valid position within bounds: ({x}, {y})")
            # Check if there is a non-'1' or non-'0' string at the clicked position
            existing_string = ''.join(self.array[y][x])
            string = simpledialog.askstring("Input", f"Enter string for position ({x}, {y}):", initialvalue=existing_string)

            if string:
                print(f"Entered string: {string}")
                # Save current state to undo stack
                self.undo_stack.append((x, y, self.array[y][x][:]))
                self.array[y][x] = list(string)
                if string not in string_colors:
                    string_colors[string] = generate_color()
                    print(f"Generated color for {string}: {string_colors[string]}")
                self.update_image(x, y)
                save_array()
                save_legend()
                self.update_legend()

    def update_image(self, x=None, y=None):
        global scaled_image
        scaled_image = array_to_image(self.array, self.scale_factor)

        self.photo_img = ImageTk.PhotoImage(scaled_image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.photo_img)
        self.canvas.update()

    def periodic_save(self):
        save_array()
        save_legend()
        self.after(self.save_interval, self.periodic_save)

    def on_closing(self):
        save_array()
        save_legend()
        self.destroy()

    def create_legend(self):
        self.legend_window = tk.Toplevel(self)
        self.legend_window.title("Color Legend")
        self.legend_listbox = tk.Listbox(self.legend_window)
        self.legend_listbox.pack(fill=tk.BOTH, expand=True)
        self.update_legend()

    def update_legend(self):
        self.legend_listbox.delete(0, tk.END)
        for y in range(height):
            for x in range(width):
                string = ''.join(self.array[y][x])
                if string not in ['0', '1']:
                    color = string_colors[string]
                    self.legend_listbox.insert(tk.END, f"Name: {string}, Location: ({x}, {y}), RGB: {color}")

# Register atexit handler to save array and legend on exit
atexit.register(save_array)
atexit.register(save_legend)

# Create and run the GUI
app = StoreMapEditor(scaled_image, array_2d, scale_factor)
app.mainloop()
