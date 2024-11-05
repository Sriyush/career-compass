import joblib
import sys
import json
import numpy as np

# Load the model
try:
    model = joblib.load('/home/sriyush/Downloads/randomforest.pkl')
except FileNotFoundError:
    print(json.dumps({"error": "Model file not found"}))
    sys.exit(1)

# Input data from the argument
input_data = json.loads(sys.argv[1])
# Predict probabilities instead of classes
probabilities = model.predict_proba([input_data])[0]  # Get probabilities for the input
top_3_indices = np.argsort(probabilities)[-3:][::-1]  # Get indices of the top 3 probabilities

# Map numeric predictions to course categories
numeric_to_category = {
    0: 'Animation, Graphics and Multimedia',
    1: 'B.Arch- Bachelor of Architecture',
    2: 'B.Com- Bachelor of Commerce',
    3: 'B.Ed.',
    4: 'B.Sc- Applied Geology',
    5: 'B.Sc- Nursing',
    6: 'B.Sc. Chemistry',
    7: 'B.Sc. Mathematics',
    8: 'B.Sc.- Information Technology',
    9: 'B.Sc.- Physics',
    10: 'B.Tech.-Civil Engineering',
    11: 'B.Tech.-Computer Science and Engineering',
    12: 'B.Tech.-Electrical and Electronics Engineering',
    13: 'B.Tech.-Electronics and Communication Engineering',
    14: 'B.Tech.-Mechanical Engineering',
    15: 'BA in Economics',
    16: 'BA in English',
    17: 'BA in Hindi',
    18: 'BA in History',
    19: 'BBA- Bachelor of Business Administration',
    20: 'BBS- Bachelor of Business Studies',
    21: 'BCA- Bachelor of Computer Applications',
    22: 'BDS- Bachelor of Dental Surgery',
    23: 'BEM- Bachelor of Event Management',
    24: 'BFD- Bachelor of Fashion Designing',
    25: 'BJMC- Bachelor of Journalism and Mass Communication',
    26: 'BPharma- Bachelor of Pharmacy',
    27: 'BTTM- Bachelor of Travel and Tourism Management',
    28: 'BVA- Bachelor of Visual Arts',
    29: 'CA- Chartered Accountancy',
    30: 'CS- Company Secretary',
    31: 'Civil Services',
    32: 'Diploma in Dramatic Arts',
    33: 'Integrated Law Course- BA + LL.B',
    34: 'MBBS'
}

# Retrieve the suggested courses based on the top 3 probabilities
suggested_courses = [numeric_to_category[idx] for idx in top_3_indices if idx in numeric_to_category]

# Return the suggested courses
print(json.dumps(suggested_courses))
