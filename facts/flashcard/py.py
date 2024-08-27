import os

def combine_sentences(input_file, output_file):
    input_file = os.path.join(os.getcwd(), input_file)
    output_file = os.path.join(os.getcwd(), output_file)

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("Input file not found.")
        return
    except Exception as e:
        print("An error occurred while reading the input file:", e)
        return

    combined_text = ""
    for line in lines:
        line = line.strip()
        if line.startswith("⬥"):
            if combined_text:  # Add newline if not the first line
                combined_text += "\n"
            combined_text += line
        else:
            combined_text += " " + line

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(combined_text)
        print("Output file generated successfully!")
    except Exception as e:
        print("An error occurred while writing to the output file:", e)

# Usage example
combine_sentences("data.txt", "modified_data.txt")
