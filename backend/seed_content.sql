-- ============================================================
-- EduVerse Seed Data
-- ============================================================

-- ── Learning Paths ──
INSERT INTO learning_paths (slug, title, description, icon, color, "order", is_active) VALUES
('programming', 'Programming', 'Master programming from basics to advanced concepts with hands-on coding exercises.', 'code', '#6366f1', 1, true),
('mathematics', 'Mathematics', 'Build a strong mathematical foundation covering algebra, calculus, and beyond.', 'calculator', '#f59e0b', 2, true),
('physics', 'Physics', 'Understand the fundamental laws that govern the universe.', 'atom', '#10b981', 3, true);

-- ── Courses ──

-- Programming > Python Fundamentals
INSERT INTO courses (path_id, slug, title, description, difficulty, estimated_hours, "order", is_active) VALUES
(1, 'python-fundamentals', 'Python Fundamentals', 'Learn Python programming from scratch. Covers variables, data types, control flow, functions, and object-oriented programming.', 'beginner', 12, 1, true);

-- Mathematics > Algebra Foundations
INSERT INTO courses (path_id, slug, title, description, difficulty, estimated_hours, "order", is_active) VALUES
(2, 'algebra-foundations', 'Algebra Foundations', 'Master the core concepts of algebra: expressions, equations, functions, and graphing.', 'beginner', 10, 1, true);

-- Physics > Classical Mechanics
INSERT INTO courses (path_id, slug, title, description, difficulty, estimated_hours, "order", is_active) VALUES
(3, 'classical-mechanics', 'Classical Mechanics', 'Explore motion, forces, energy, and momentum in classical physics.', 'intermediate', 14, 1, true);

-- ── Lessons: Programming → Python Fundamentals ──
-- Lesson 1
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  1,
  'Variables and Data Types',
  'Learn about Python variables, integers, floats, strings, and booleans.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Variables and Data Types in Python"}},
    {"type": "text", "data": {"text": "Python is a dynamically-typed language, meaning you don''t have to declare the type of a variable explicitly. The interpreter infers the type at runtime."}},
    {"type": "heading", "data": {"level": 2, "text": "Basic Data Types"}},
    {"type": "text", "data": {"text": "Python has several built-in data types. The most common ones are:"}},
    {"type": "code", "data": {"language": "python", "text": "# Integer\nage = 25\nprint(type(age))  # <class ''int''>\n\n# Float\npi = 3.14159\nprint(type(pi))  # <class ''float''>\n\n# String\nname = \"Alice\"\nprint(type(name))  # <class ''str''>\n\n# Boolean\nis_student = True\nprint(type(is_student))  # <class ''bool''>"}},
    {"type": "heading", "data": {"level": 2, "text": "Variable Naming Rules"}},
    {"type": "text", "data": {"text": "1. Variable names can contain letters, numbers, and underscores.\n2. They cannot start with a number.\n3. They are case-sensitive (age, Age, and AGE are different).\n4. Avoid using Python keywords like if, for, while as variable names."}},
    {"type": "callout", "data": {"type": "tip", "text": "Use descriptive variable names! Instead of ''x'', use ''student_count'' or ''total_price''. Your future self will thank you."}},
    {"type": "heading", "data": {"level": 2, "text": "Type Conversion"}},
    {"type": "code", "data": {"language": "python", "text": "# Converting between types\nprice = \"19.99\"\nprice_float = float(price)  # 19.99\nprice_int = int(price_float)  # 19 (truncates!)\nmessage = \"Price: $\" + str(price_float)  # Concatenation\nprint(message)  # Price: $19.99"}},
    {"type": "text", "data": {"text": "Remember: you cannot concatenate a string with a number directly. Use str() to convert numbers to strings first."}}
  ]',
  1, 'standard', 20
);

-- Lesson 2
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  1,
  'Control Flow: Conditionals and Loops',
  'Understand if/elif/else statements and for/while loops to control program execution.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Control Flow in Python"}},
    {"type": "text", "data": {"text": "Control flow allows your program to make decisions and repeat actions. This is what makes programs intelligent and useful."}},
    {"type": "heading", "data": {"level": 2, "text": "Conditional Statements (if/elif/else)"}},
    {"type": "code", "data": {"language": "python", "text": "score = 85\n\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelif score >= 70:\n    grade = \"C\"\nelse:\n    grade = \"F\"\n\nprint(f\"Your grade is: {grade}\")  # Your grade is: B"}},
    {"type": "callout", "data": {"type": "warning", "text": "Indentation matters in Python! Use 4 spaces for each indentation level. Mixing tabs and spaces will cause errors."}},
    {"type": "heading", "data": {"level": 2, "text": "For Loops"}},
    {"type": "code", "data": {"language": "python", "text": "# Iterating over a list\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(fruit)\n\n# Using range()\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# Loop with index\nfor index, fruit in enumerate(fruits):\n    print(f\"{index}: {fruit}\")"}},
    {"type": "heading", "data": {"level": 2, "text": "While Loops"}},
    {"type": "code", "data": {"language": "python", "text": "count = 0\nwhile count < 5:\n    print(f\"Count is {count}\")\n    count += 1  # Don''t forget to increment!"}},
    {"type": "text", "data": {"text": "Be careful with while loops — if the condition never becomes False, you''ll create an infinite loop! Use Ctrl+C to break out."}}
  ]',
  2, 'standard', 25
);

-- Lesson 3
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  1,
  'Functions and Modules',
  'Write reusable code with functions and organize your projects using modules.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Functions and Modules"}},
    {"type": "text", "data": {"text": "Functions are reusable blocks of code that perform a specific task. Modules allow you to organize related functions and variables into separate files."}},
    {"type": "heading", "data": {"level": 2, "text": "Defining Functions"}},
    {"type": "code", "data": {"language": "python", "text": "def greet(name, greeting=\"Hello\"):\n    \"\"\"Return a personalized greeting.\"\"\"\n    return f\"{greeting}, {name}!\"\n\nprint(greet(\"Alice\"))        # Hello, Alice!\nprint(greet(\"Bob\", \"Hi\"))    # Hi, Bob!"}},
    {"type": "heading", "data": {"level": 2, "text": "Parameters and Return Values"}},
    {"type": "code", "data": {"language": "python", "text": "def calculate_stats(numbers):\n    total = sum(numbers)\n    count = len(numbers)\n    average = total / count if count > 0 else 0\n    return {\n        \"total\": total,\n        \"count\": count,\n        \"average\": average,\n        \"max\": max(numbers),\n        \"min\": min(numbers)\n    }\n\nresult = calculate_stats([10, 20, 30, 40, 50])\nprint(result[\"average\"])  # 30.0"}},
    {"type": "callout", "data": {"type": "tip", "text": "Always write docstrings (the triple-quoted comment right after the function definition) to document what your function does."}},
    {"type": "heading", "data": {"level": 2, "text": "Importing Modules"}},
    {"type": "code", "data": {"language": "python", "text": "# Import the whole module\nimport math\nprint(math.sqrt(16))  # 4.0\n\n# Import specific functions\nfrom random import randint, choice\nprint(randint(1, 10))  # Random number between 1 and 10\nprint(choice([\"a\", \"b\", \"c\"]))  # Random element\n\n# Alias imports\nimport datetime as dt\nnow = dt.datetime.now()\nprint(now.year)"}}
  ]',
  3, 'standard', 25
);

-- Lesson 4
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  1,
  'Object-Oriented Programming',
  'Learn classes, objects, inheritance, and encapsulation in Python.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Object-Oriented Programming in Python"}},
    {"type": "text", "data": {"text": "OOP is a programming paradigm that organizes code around objects and classes. Python supports all major OOP concepts."}},
    {"type": "heading", "data": {"level": 2, "text": "Creating a Class"}},
    {"type": "code", "data": {"language": "python", "text": "class Student:\n    def __init__(self, name, age, grade):\n        self.name = name\n        self.age = age\n        self.grade = grade\n\n    def introduce(self):\n        return f\"Hi, I''m {self.name}, age {self.age}, in grade {self.grade}\"\n\n    def is_passing(self):\n        return self.grade >= 60\n\n# Creating an instance\nalice = Student(\"Alice\", 20, 85)\nprint(alice.introduce())  # Hi, I''m Alice...\nprint(alice.is_passing())  # True"}},
    {"type": "heading", "data": {"level": 2, "text": "Inheritance"}},
    {"type": "code", "data": {"language": "python", "text": "class GraduateStudent(Student):\n    def __init__(self, name, age, grade, thesis_topic):\n        super().__init__(name, age, grade)\n        self.thesis_topic = thesis_topic\n\n    def introduce(self):\n        base = super().introduce()\n        return f\"{base} and I research {self.thesis_topic}\"\n\nbob = GraduateStudent(\"Bob\", 25, 90, \"Machine Learning\")\nprint(bob.introduce())"}},
    {"type": "callout", "data": {"type": "info", "text": "Use super() to call methods from the parent class. This avoids duplicating code and makes inheritance work correctly."}},
    {"type": "heading", "data": {"level": 2, "text": "Encapsulation"}},
    {"type": "code", "data": {"language": "python", "text": "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner       # Public\n        self._balance = balance   # Protected (convention)\n        self.__pin = \"1234\"       # Private (name mangling)\n\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount\n            return True\n        return False\n\n    def get_balance(self):\n        return self._balance\n\naccount = BankAccount(\"Alice\", 1000)\naccount.deposit(500)\nprint(account.get_balance())  # 1500"}}
  ]',
  4, 'standard', 30
);

-- ── Lessons: Mathematics → Algebra Foundations ──
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  2,
  'Expressions and Equations',
  'Learn to write and manipulate algebraic expressions and solve linear equations.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Algebraic Expressions and Equations"}},
    {"type": "text", "data": {"text": "Algebra is the branch of mathematics that uses symbols to represent numbers and quantities in formulas and equations."}},
    {"type": "heading", "data": {"level": 2, "text": "Variables and Expressions"}},
    {"type": "text", "data": {"text": "An algebraic expression combines numbers, variables, and operations. For example: 3x + 5 is an expression where x is a variable."}},
    {"type": "code", "data": {"language": "text", "text": "Expression: 3x + 5\n- 3 is the coefficient\n- x is the variable\n- 5 is the constant\n- + is the operator"}},
    {"type": "heading", "data": {"level": 2, "text": "Solving Linear Equations"}},
    {"type": "text", "data": {"text": "To solve an equation, isolate the variable on one side using inverse operations."}},
    {"type": "code", "data": {"language": "text", "text": "Solve: 2x + 7 = 15\n\nStep 1: Subtract 7 from both sides\n2x + 7 - 7 = 15 - 7\n2x = 8\n\nStep 2: Divide both sides by 2\n2x/2 = 8/2\nx = 4\n\nCheck: 2(4) + 7 = 8 + 7 = 15 ✓"}},
    {"type": "callout", "data": {"type": "tip", "text": "Whatever operation you do to one side, you must do to the other. This keeps the equation balanced!"}},
    {"type": "heading", "data": {"level": 2, "text": "Distributive Property"}},
    {"type": "code", "data": {"language": "text", "text": "a(b + c) = ab + ac\n\nExample: 3(x + 4) = 3x + 12\n\nSolve: 3(x + 4) = 30\n3x + 12 = 30\n3x = 18\nx = 6"}}
  ]',
  1, 'standard', 20
);

INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  2,
  'Linear Functions and Graphing',
  'Understand slope, intercepts, and how to graph linear functions on the coordinate plane.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Linear Functions and Graphing"}},
    {"type": "text", "data": {"text": "A linear function creates a straight line when graphed. The standard form is y = mx + b."}},
    {"type": "heading", "data": {"level": 2, "text": "Slope-Intercept Form"}},
    {"type": "code", "data": {"language": "text", "text": "y = mx + b\n\nWhere:\nm = slope (rate of change)\nb = y-intercept (where line crosses y-axis)\n\nSlope = rise / run = (y2 - y1) / (x2 - x1)"}},
    {"type": "text", "data": {"text": "A positive slope means the line goes upward from left to right. A negative slope means it goes downward."}},
    {"type": "heading", "data": {"level": 2, "text": "Finding Slope"}},
    {"type": "code", "data": {"language": "text", "text": "Points: (1, 3) and (4, 9)\n\nslope = (9 - 3) / (4 - 1)\nslope = 6 / 3\nslope = 2\n\nThe line rises 2 units for every 1 unit it moves right."}},
    {"type": "callout", "data": {"type": "info", "text": "A horizontal line has slope 0 (y = constant). A vertical line has undefined slope (x = constant)."}},
    {"type": "heading", "data": {"level": 2, "text": "Graphing Steps"}},
    {"type": "text", "data": {"text": "1. Plot the y-intercept (0, b)\n2. Use the slope to find another point (rise/run)\n3. Draw a line through both points\n4. Extend the line with arrows on both ends"}}
  ]',
  2, 'standard', 25
);

INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  2,
  'Systems of Equations',
  'Solve systems of linear equations using substitution, elimination, and graphing methods.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Systems of Equations"}},
    {"type": "text", "data": {"text": "A system of equations is a set of two or more equations with the same variables. The solution is the point(s) that satisfy all equations."}},
    {"type": "heading", "data": {"level": 2, "text": "Solving by Substitution"}},
    {"type": "code", "data": {"language": "text", "text": "System:\ny = 2x + 1\ny = -x + 7\n\nSince both equal y:\n2x + 1 = -x + 7\n3x + 1 = 7\n3x = 6\nx = 2\n\nSubstitute x = 2 into either equation:\ny = 2(2) + 1 = 5\n\nSolution: (2, 5)"}},
    {"type": "heading", "data": {"level": 2, "text": "Solving by Elimination"}},
    {"type": "code", "data": {"language": "text", "text": "System:\n2x + 3y = 12\n4x - 3y = 6\n\nAdd both equations (y terms cancel):\n6x = 18\nx = 3\n\nSubstitute x = 3:\n2(3) + 3y = 12\n6 + 3y = 12\n3y = 6\ny = 2\n\nSolution: (3, 2)"}},
    {"type": "callout", "data": {"type": "warning", "text": "Not all systems have a single solution! Parallel lines have no solution. Coincident lines have infinitely many solutions."}}
  ]',
  3, 'standard', 25
);

-- ── Lessons: Physics → Classical Mechanics ──
INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  3,
  'Newton''s Laws of Motion',
  'Learn the three fundamental laws that describe how objects move under the influence of forces.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Newton''s Laws of Motion"}},
    {"type": "text", "data": {"text": "Sir Isaac Newton published his three laws of motion in 1687 in the Philosophiæ Naturalis Principia Mathematica. These laws form the foundation of classical mechanics."}},
    {"type": "heading", "data": {"level": 2, "text": "First Law — Law of Inertia"}},
    {"type": "text", "data": {"text": "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced force."}},
    {"type": "code", "data": {"language": "text", "text": "Example:\nA hockey puck sliding on ice continues moving until friction stops it.\nA book on a table stays put unless you push it."}},
    {"type": "callout", "data": {"type": "tip", "text": "Inertia is proportional to mass. Heavier objects have more inertia and are harder to move or stop."}},
    {"type": "heading", "data": {"level": 2, "text": "Second Law — F = ma"}},
    {"type": "text", "data": {"text": "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."}},
    {"type": "code", "data": {"language": "text", "text": "F = ma\n\nWhere:\nF = net force (Newtons)\nm = mass (kg)\na = acceleration (m/s²)\n\nExample: A 5kg object accelerates at 3 m/s²\nF = 5 × 3 = 15 N"}},
    {"type": "heading", "data": {"level": 2, "text": "Third Law — Action-Reaction"}},
    {"type": "text", "data": {"text": "For every action, there is an equal and opposite reaction. Forces always come in pairs."}},
    {"type": "code", "data": {"language": "text", "text": "Examples:\n- When you jump, you push down on Earth, and Earth pushes you up.\n- A rocket pushes exhaust gases down, and the gases push the rocket up.\n- When you walk, you push backward on the ground, and the ground pushes you forward."}}
  ]',
  1, 'standard', 30
);

INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  3,
  'Work, Energy, and Power',
  'Understand the concepts of work, kinetic and potential energy, and the conservation of energy.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Work, Energy, and Power"}},
    {"type": "text", "data": {"text": "Energy is the ability to do work. Work is the transfer of energy through force applied over a distance."}},
    {"type": "heading", "data": {"level": 2, "text": "Work"}},
    {"type": "code", "data": {"language": "text", "text": "W = F × d × cos(θ)\n\nWhere:\nW = work (Joules)\nF = force (Newtons)\nd = displacement (meters)\nθ = angle between force and displacement\n\nIf force and displacement are in the same direction:\nW = F × d"}},
    {"type": "text", "data": {"text": "Work is only done when a force causes displacement. Holding a heavy box stationary does no work (no displacement)."}},
    {"type": "heading", "data": {"level": 2, "text": "Kinetic Energy"}},
    {"type": "code", "data": {"language": "text", "text": "KE = ½mv²\n\nWhere:\nKE = kinetic energy (Joules)\nm = mass (kg)\nv = velocity (m/s)\n\nExample: A 2kg ball moving at 3 m/s\nKE = ½ × 2 × 3² = 9 J"}},
    {"type": "heading", "data": {"level": 2, "text": "Potential Energy"}},
    {"type": "code", "data": {"language": "text", "text": "PE = mgh\n\nWhere:\nPE = gravitational potential energy (Joules)\nm = mass (kg)\ng = gravitational acceleration (9.8 m/s²)\nh = height (meters)\n\nExample: A 5kg object at 10m height\nPE = 5 × 9.8 × 10 = 490 J"}},
    {"type": "callout", "data": {"type": "info", "text": "The Law of Conservation of Energy: Energy cannot be created or destroyed, only converted from one form to another. In a closed system, total energy remains constant."}},
    {"type": "heading", "data": {"level": 2, "text": "Power"}},
    {"type": "code", "data": {"language": "text", "text": "P = W / t\n\nWhere:\nP = power (Watts)\nW = work (Joules)\nt = time (seconds)\n\n1 Watt = 1 Joule per second"}}
  ]',
  2, 'standard', 30
);

INSERT INTO lessons (course_id, title, description, content, "order", lesson_type, estimated_minutes) VALUES
(
  3,
  'Momentum and Collisions',
  'Explore linear momentum, impulse, and conservation of momentum in elastic and inelastic collisions.',
  '[
    {"type": "heading", "data": {"level": 1, "text": "Momentum and Collisions"}},
    {"type": "text", "data": {"text": "Momentum is a measure of the quantity of motion an object has. It depends on both mass and velocity."}},
    {"type": "heading", "data": {"level": 2, "text": "Linear Momentum"}},
    {"type": "code", "data": {"language": "text", "text": "p = mv\n\nWhere:\np = momentum (kg·m/s)\nm = mass (kg)\nv = velocity (m/s)\n\nExample: A 1000kg car at 20 m/s\np = 1000 × 20 = 20,000 kg·m/s"}},
    {"type": "heading", "data": {"level": 2, "text": "Impulse"}},
    {"type": "code", "data": {"language": "text", "text": "J = F × Δt = Δp\n\nWhere:\nJ = impulse (N·s)\nF = force (N)\nΔt = time interval (s)\nΔp = change in momentum\n\nExample: A 100N force applied for 0.5s\nJ = 100 × 0.5 = 50 N·s"}},
    {"type": "text", "data": {"text": "Impulse explains why airbags save lives — they increase the time of impact, reducing the force experienced."}},
    {"type": "heading", "data": {"level": 2, "text": "Conservation of Momentum"}},
    {"type": "code", "data": {"language": "text", "text": "In a closed system:\np_before = p_after\n\nElastic collision (objects bounce):\nm₁v₁i + m₂v₂i = m₁v₁f + m₂v₂f\n\nInelastic collision (objects stick):\nm₁v₁i + m₂v₂i = (m₁ + m₂)vf"}},
    {"type": "callout", "data": {"type": "warning", "text": "In real-world collisions, some kinetic energy is always converted to heat and sound. Perfectly elastic collisions are idealizations that only approximately occur (e.g., billiard balls)."}}
  ]',
  3, 'standard', 30
);

-- ── Exams ──

-- Course Exam: Python Fundamentals (course_id = 1)
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(1, NULL, 'Python Fundamentals Final Exam', 'Test your overall understanding of Python programming concepts.', 'course_exam', 60, 70, 1);

-- Lesson Quizzes: Programming
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 1, 'Variables Quiz', 'Check your understanding of variables and data types.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 2, 'Control Flow Quiz', 'Test your knowledge of conditionals and loops.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 3, 'Functions Quiz', 'Check your understanding of functions and modules.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 4, 'OOP Quiz', 'Test your knowledge of object-oriented programming.', 'lesson_quiz', 10, 60, 1);

-- Course Exam: Algebra Foundations (course_id = 2)
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(2, NULL, 'Algebra Foundations Final Exam', 'Comprehensive test of your algebra skills.', 'course_exam', 60, 70, 1);

-- Lesson Quizzes: Mathematics
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 5, 'Expressions Quiz', 'Check your understanding of expressions and equations.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 6, 'Graphing Quiz', 'Test your knowledge of linear functions and graphing.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 7, 'Systems Quiz', 'Check your understanding of systems of equations.', 'lesson_quiz', 10, 60, 1);

-- Course Exam: Classical Mechanics (course_id = 3)
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(3, NULL, 'Classical Mechanics Final Exam', 'Comprehensive test of classical mechanics concepts.', 'course_exam', 60, 70, 1);

-- Lesson Quizzes: Physics
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 8, 'Newton''s Laws Quiz', 'Check your understanding of Newton''s three laws.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 9, 'Energy Quiz', 'Test your knowledge of work, energy, and power.', 'lesson_quiz', 10, 60, 1);
INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, "order") VALUES
(NULL, 10, 'Momentum Quiz', 'Check your understanding of momentum and collisions.', 'lesson_quiz', 10, 60, 1);

-- ── Questions ──

-- Python Fundamentals Course Exam (exam_id = 1)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(1, 'Which of the following is the correct way to create a list in Python?',
 '["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "<1, 2, 3>"]',
 '[1, 2, 3]', 'Lists use square brackets []. Curly braces {} create sets, parentheses () create tuples.',
 'multiple_choice', 2, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(1, 'What does the len() function return?',
 '["The length of a string or collection", "The largest element", "The smallest element", "The type of the object"]',
 'The length of a string or collection', 'len() returns the number of items in an object: the length of a string, list, tuple, etc.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(1, 'What is the output of: print(type(3.14))',
 '["<class ''int''>", "<class ''float''>", "<class ''str''>", "<class ''decimal''>"]',
 '<class ''float''>', '3.14 is a floating-point number, so type() returns <class ''float''>.',
 'multiple_choice', 1, 3);

-- Python Lesson 1 Quiz: Variables (exam_id = 2)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(2, 'What is the type of the value True in Python?',
 '["str", "int", "bool", "NoneType"]',
 'bool', 'True and False are boolean values in Python, with type bool.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(2, 'Which of the following is NOT a valid Python variable name?',
 '["my_var", "_count", "2nd_value", "totalSum"]',
 '2nd_value', 'Variable names cannot start with a number. my_var, _count, and totalSum are all valid.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(2, 'What is the output of: print(str(42))',
 '["42", "''42''", "42 (as string)", "Error"]',
 '42', 'str(42) converts the integer 42 to the string "42", which prints as 42.',
 'multiple_choice', 1, 3);

-- Python Lesson 2 Quiz: Control Flow (exam_id = 3)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(3, 'What is the output of: print(10 > 5 and 3 < 1)',
 '["True", "False", "Error", "None"]',
 'False', '10 > 5 is True, but 3 < 1 is False. True and False evaluates to False.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(3, 'Which loop is guaranteed to execute at least once?',
 '["for loop", "while loop", "Neither", "Both"]',
 'Neither', 'Both for and while loops check their condition before executing the first iteration. There is no do-while in Python.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(3, 'What does range(5) generate?',
 '["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "1, 2, 3, 4"]',
 '0, 1, 2, 3, 4', 'range(n) generates numbers from 0 to n-1. So range(5) produces 0, 1, 2, 3, 4.',
 'multiple_choice', 1, 3);

-- Python Lesson 3 Quiz: Functions (exam_id = 4)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(4, 'What keyword is used to define a function in Python?',
 '["func", "define", "def", "function"]',
 'def', 'Python uses the def keyword to define functions.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(4, 'What is a docstring?',
 '["A string that documents what a function does", "A comment that is ignored", "A variable type", "An error message"]',
 'A string that documents what a function does', 'A docstring is a triple-quoted string right after a function definition that explains what the function does.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(4, 'What does import math do?',
 '["Imports only the math function", "Imports the entire math module", "Creates a new math file", "Runs the math script"]',
 'Imports the entire math module', 'import math imports the entire math module, giving access to all its functions like math.sqrt(), math.pi, etc.',
 'multiple_choice', 1, 3);

-- Python Lesson 4 Quiz: OOP (exam_id = 5)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(5, 'What method is called when a new object is created in Python?',
 '["__new__", "__init__", "__create__", "__str__"]',
 '__init__', 'The __init__ method is the constructor that initializes object attributes when an instance is created.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(5, 'What does the super() function do?',
 '["Creates a new super class", "Calls a method from the parent class", "Deletes the current class", "Returns the superuser"]',
 'Calls a method from the parent class', 'super() returns a proxy object that delegates method calls to a parent or sibling class.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(5, 'Which of the following is NOT an OOP pillar?',
 '["Encapsulation", "Inheritance", "Compilation", "Polymorphism"]',
 'Compilation', 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction. Compilation is not an OOP concept.',
 'multiple_choice', 1, 3);

-- Algebra Course Exam (exam_id = 6)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(6, 'Solve for x: 3x + 7 = 22',
 '["x = 5", "x = 7", "x = 3", "x = 15"]',
 'x = 5', '3x + 7 = 22 → 3x = 15 → x = 5.',
 'multiple_choice', 2, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(6, 'What is the slope of the line y = -2x + 5?',
 '["2", "-2", "5", "-5"]',
 '-2', 'In y = mx + b, m is the slope. Here m = -2.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(6, 'How many solutions does a system of parallel lines have?',
 '["One", "Infinite", "None", "Two"]',
 'None', 'Parallel lines never intersect, so there is no solution.',
 'multiple_choice', 1, 3);

-- Algebra Lesson 1 Quiz: Expressions (exam_id = 7)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(7, 'What is the coefficient in the expression 5x - 3?',
 '["x", "5", "-3", "5x"]',
 '5', 'The coefficient is the number multiplied by the variable, which is 5.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(7, 'Solve: x - 8 = 3',
 '["x = 11", "x = 5", "x = -5", "x = 24"]',
 'x = 11', 'x - 8 = 3 → x = 3 + 8 → x = 11.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(7, 'Simplify: 2(x + 3)',
 '["2x + 3", "2x + 6", "x + 6", "2x + 5"]',
 '2x + 6', '2(x + 3) = 2x + 6 using the distributive property.',
 'multiple_choice', 1, 3);

-- Algebra Lesson 2 Quiz: Graphing (exam_id = 8)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(8, 'What is the y-intercept of y = 3x - 4?',
 '["3", "-4", "4", "0"]',
 '-4', 'In y = mx + b, b is the y-intercept. Here b = -4.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(8, 'What type of line has a slope of 0?',
 '["Vertical", "Horizontal", "Diagonal", "Curved"]',
 'Horizontal', 'A horizontal line has slope 0 because there is no rise (change in y = 0).',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(8, 'Find the slope between (2, 4) and (6, 12)',
 '["2", "3", "4", "1"]',
 '2', 'slope = (12-4)/(6-2) = 8/4 = 2.',
 'multiple_choice', 1, 3);

-- Algebra Lesson 3 Quiz: Systems (exam_id = 9)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(9, 'What does it mean when two lines intersect at (3, -2)?',
 '["x = 3, y = -2 is the solution", "No solution", "Infinite solutions", "The system is broken"]',
 'x = 3, y = -2 is the solution', 'The intersection point is the solution that satisfies both equations.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(9, 'Solve by elimination: x + y = 10, x - y = 2',
 '["(6, 4)", "(4, 6)", "(8, 2)", "(5, 5)"]',
 '(6, 4)', 'Adding: 2x = 12 → x = 6. Then 6 + y = 10 → y = 4.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(9, 'What does it mean if both equations in a system simplify to the same line?',
 '["One solution", "No solution", "Infinite solutions", "Cannot determine"]',
 'Infinite solutions', 'If both equations represent the same line, every point on the line is a solution.',
 'multiple_choice', 1, 3);

-- Physics Course Exam (exam_id = 10)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(10, 'Which of Newton''s laws explains why a rocket works?',
 '["First Law", "Second Law", "Third Law", "Law of Gravitation"]',
 'Third Law', 'The Third Law (action-reaction) explains rockets: exhaust gases pushed down → rocket pushed up.',
 'multiple_choice', 2, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(10, 'What is the SI unit of work?',
 '["Newton", "Joule", "Watt", "Pascal"]',
 'Joule', 'Work is measured in Joules (N·m).',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(10, 'In a perfectly inelastic collision, what happens?',
 '["Objects bounce apart", "Objects stick together", "Objects pass through each other", "Objects disappear"]',
 'Objects stick together', 'In a perfectly inelastic collision, the objects stick together and move with the same velocity.',
 'multiple_choice', 1, 3);

-- Physics Lesson 1 Quiz: Newton (exam_id = 11)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(11, 'What is inertia proportional to?',
 '["Velocity", "Acceleration", "Mass", "Force"]',
 'Mass', 'Inertia is directly proportional to mass. Heavier objects have more inertia.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(11, 'A 10 kg object accelerates at 5 m/s². What is the net force?',
 '["2 N", "15 N", "50 N", "5 N"]',
 '50 N', 'F = ma = 10 × 5 = 50 N.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(11, 'What forces are acting on a book resting on a table?',
 '["Gravity only", "Normal force only", "Gravity and normal force are balanced", "No forces at all"]',
 'Gravity and normal force are balanced', 'Gravity pulls down, the table pushes up with an equal normal force. The net force is zero.',
 'multiple_choice', 1, 3);

-- Physics Lesson 2 Quiz: Energy (exam_id = 12)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(12, 'What is the kinetic energy of a 4 kg object moving at 3 m/s?',
 '["6 J", "12 J", "18 J", "36 J"]',
 '18 J', 'KE = ½ × 4 × 3² = ½ × 4 × 9 = 18 J.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(12, 'A 60 kg person climbs 5 meters. What is their potential energy gain? (g = 10 m/s²)',
 '["300 J", "3000 J", "60 J", "600 J"]',
 '3000 J', 'PE = mgh = 60 × 10 × 5 = 3000 J.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(12, 'What is power if 200 J of work is done in 4 seconds?',
 '["50 W", "800 W", "40 W", "200 W"]',
 '50 W', 'P = W/t = 200/4 = 50 W.',
 'multiple_choice', 1, 3);

-- Physics Lesson 3 Quiz: Momentum (exam_id = 13)
INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(13, 'What is the momentum of a 5 kg object moving at 2 m/s?',
 '["2.5 kg·m/s", "10 kg·m/s", "7 kg·m/s", "3 kg·m/s"]',
 '10 kg·m/s', 'p = mv = 5 × 2 = 10 kg·m/s.',
 'multiple_choice', 1, 1);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(13, 'If a force of 20 N is applied for 3 seconds, what is the impulse?',
 '["60 N·s", "6.67 N·s", "23 N·s", "17 N·s"]',
 '60 N·s', 'J = F × Δt = 20 × 3 = 60 N·s.',
 'multiple_choice', 1, 2);

INSERT INTO questions (exam_id, question_text, options, correct_answer, explanation, question_type, points, "order") VALUES
(13, 'In which collision type is kinetic energy conserved?',
 '["Inelastic", "Perfectly inelastic", "Elastic", "No collisions conserve KE"]',
 'Elastic', 'In elastic collisions, both momentum and kinetic energy are conserved. In inelastic collisions, some KE is lost.',
 'multiple_choice', 1, 3);
