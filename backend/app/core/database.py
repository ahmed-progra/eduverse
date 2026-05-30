import json
import os
import sqlite3
from datetime import datetime, timezone

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
DB_PATH = os.environ.get("EDUVERSE_DB_PATH") or os.path.join(DB_DIR, "eduverse.db")


def get_conn() -> sqlite3.Connection:
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE,
            full_name TEXT,
            avatar_url TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS learning_paths (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            color TEXT,
            "order" INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path_id INTEGER NOT NULL REFERENCES learning_paths(id),
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            difficulty TEXT,
            estimated_hours REAL,
            "order" INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL REFERENCES courses(id),
            title TEXT NOT NULL,
            description TEXT,
            content TEXT,
            "order" INTEGER DEFAULT 0,
            lesson_type TEXT DEFAULT 'standard',
            estimated_minutes INTEGER DEFAULT 20
        );

        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER REFERENCES courses(id),
            lesson_id INTEGER REFERENCES lessons(id),
            title TEXT NOT NULL,
            description TEXT,
            exam_type TEXT NOT NULL,
            time_limit_minutes INTEGER,
            passing_score REAL DEFAULT 70,
            "order" INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL REFERENCES exams(id),
            question_text TEXT NOT NULL,
            options TEXT,
            correct_answer TEXT NOT NULL,
            explanation TEXT,
            question_type TEXT DEFAULT 'multiple_choice',
            points INTEGER DEFAULT 1,
            "order" INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            lesson_id INTEGER NOT NULL,
            course_id INTEGER,
            path_id INTEGER,
            completed INTEGER DEFAULT 0,
            completed_at TEXT,
            UNIQUE(user_id, lesson_id)
        );

        CREATE TABLE IF NOT EXISTS exam_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            exam_id INTEGER NOT NULL REFERENCES exams(id),
            score REAL DEFAULT 0,
            total_points REAL DEFAULT 0,
            percentage REAL DEFAULT 0,
            passed INTEGER DEFAULT 0,
            answers TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            lesson_id INTEGER,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    _seed_data(conn)
    conn.close()


def _seed_data(conn: sqlite3.Connection):
    count = conn.execute("SELECT COUNT(*) FROM learning_paths").fetchone()[0]
    if count > 0:
        return

    conn.executescript("""
        INSERT INTO learning_paths (slug, title, description, icon, color, "order", is_active) VALUES
        ('programming', 'Programming', 'Master programming from basics to advanced concepts with hands-on coding exercises.', 'code', '#6366f1', 1, 1),
        ('mathematics', 'Mathematics', 'Build a strong mathematical foundation covering algebra, calculus, and beyond.', 'calculator', '#f59e0b', 2, 1),
        ('physics', 'Physics', 'Understand the fundamental laws that govern the universe.', 'atom', '#10b981', 3, 1);

        INSERT INTO courses (path_id, slug, title, description, difficulty, estimated_hours, "order", is_active) VALUES
        (1, 'cpp-fundamentals', 'C++ Fundamentals', 'Learn C++ programming from scratch. Master variables, data types, control flow, functions, arrays, and object-oriented programming.', 'beginner', 14, 1, 1),
        (2, 'algebra-foundations', 'Algebra Foundations', 'Master the core concepts of algebra: expressions, equations, functions, and graphing.', 'beginner', 10, 1, 1),
        (3, 'classical-mechanics', 'Classical Mechanics', 'Explore motion, forces, energy, and momentum in classical physics.', 'intermediate', 14, 1, 1);
    """)
    conn.commit()

    _seed_lessons(conn)
    _seed_exams_and_questions(conn)


def _seed_lessons(conn: sqlite3.Connection):
    lessons = [
        (1, 'Variables, Data Types & I/O', 'Learn C++ variables, primitive data types, and console input/output with cin and cout.',
         [{"type": "heading", "content": "C++ Variables, Data Types & I/O"},
          {"type": "text", "content": "C++ is a **statically-typed language** — you must declare the type of every variable before using it. The compiler checks types at compile time, making C++ fast and type-safe."},
          {"type": "heading", "content": "Basic Data Types"},
          {"type": "text", "content": "C++ provides several fundamental data types for storing different kinds of data."},
          {"type": "code", "language": "cpp", "content": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int age = 25;              // Integer\n    double pi = 3.14159;       // Double-precision float\n    char grade = 'A';          // Single character\n    string name = \"Alice\";     // String (requires <string>)\n    bool isStudent = true;     // Boolean (true/false)\n\n    cout << \"Age: \" << age << endl;\n    cout << \"Pi: \" << pi << endl;\n    cout << \"Grade: \" << grade << endl;\n    return 0;\n}"},
          {"type": "callout", "variant": "tip", "content": "Use **int** for whole numbers, **double** for decimals, **char** for single characters, **string** for text, and **bool** for true/false values."},
          {"type": "heading", "content": "Variable Naming Rules"},
          {"type": "text", "content": "1. Names can contain letters, digits, and underscores.\n2. They cannot start with a digit.\n3. They are **case-sensitive** (age, Age, and AGE are different).\n4. C++ keywords like `int`, `if`, `while` cannot be used.\n5. By convention, use `camelCase` or `snake_case` for variables."},
          {"type": "heading", "content": "Console Input & Output"},
          {"type": "code", "language": "cpp", "content": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n\n    cout << \"Enter your name: \";\n    getline(cin, name);        // Read full line\n\n    cout << \"Enter your age: \";\n    cin >> age;                // Read integer\n\n    cout << \"Hello, \" << name << \"! You are \"\n         << age << \" years old.\" << endl;\n    return 0;\n}"},
          {"type": "callout", "variant": "warning", "content": "**Always initialize your variables!** In C++, uninitialized local variables contain garbage values. Write `int x = 0;` not just `int x;`."},
          {"type": "heading", "content": "Type Modifiers"},
          {"type": "code", "language": "cpp", "content": "short int a = 10;      // 2 bytes\nlong int b = 100000;    // 4 or 8 bytes\nlong long c = 999999;   // 8 bytes\nunsigned int d = 42;    // Only non-negative\n\nfloat e = 3.14f;        // Single precision (less memory)\ndouble f = 3.1415926535; // Double precision (default)\n\ncout << sizeof(int) << endl;    // 4 bytes\ncout << sizeof(double) << endl; // 8 bytes"}], 1, 'standard', 25),
        (1, 'Control Flow: Conditionals & Loops', 'Master if/else, switch, for loops, while loops, and do-while in C++.',
         [{"type": "heading", "content": "Control Flow in C++"},
          {"type": "text", "content": "Control flow statements let your program make decisions, repeat tasks, and branch execution. They make programs dynamic and responsive."},
          {"type": "heading", "content": "If/Else Statements"},
          {"type": "code", "language": "cpp", "content": "int score = 85;\nchar grade;\n\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B';\n} else if (score >= 70) {\n    grade = 'C';\n} else {\n    grade = 'F';\n}\n\ncout << \"Grade: \" << grade << endl;  // Grade: B"},
          {"type": "heading", "content": "Switch Statement"},
          {"type": "code", "language": "cpp", "content": "int day = 3;\nswitch (day) {\n    case 1: cout << \"Monday\"; break;\n    case 2: cout << \"Tuesday\"; break;\n    case 3: cout << \"Wednesday\"; break;\n    case 4: cout << \"Thursday\"; break;\n    case 5: cout << \"Friday\"; break;\n    default: cout << \"Weekend\";\n}\n// Output: Wednesday"},
          {"type": "callout", "variant": "warning", "content": "Don't forget **break** in each case! Without it, execution *falls through* to the next case — a common C++ bug."},
          {"type": "heading", "content": "For Loops"},
          {"type": "code", "language": "cpp", "content": "#include <vector>\nusing namespace std;\n\n// Traditional for loop\nfor (int i = 0; i < 5; i++) {\n    cout << i << \" \";  // 0 1 2 3 4\n}\n\n// Range-based for loop (C++11+)\nvector<string> fruits = {\"apple\", \"banana\", \"cherry\"};\nfor (const string& fruit : fruits) {\n    cout << fruit << \" \";\n}"},
          {"type": "heading", "content": "While & Do-While"},
          {"type": "code", "language": "cpp", "content": "// While loop — checks condition first\nint count = 0;\nwhile (count < 5) {\n    cout << count << \" \";\n    count++;\n}\n// Output: 0 1 2 3 4\n\n// Do-while — executes at least once\nint num;\ndo {\n    cout << \"Enter a positive number: \";\n    cin >> num;\n} while (num <= 0);"},
          {"type": "callout", "variant": "danger", "content": "**Infinite loops** crash your program! Always ensure the loop condition will eventually become false. Use Ctrl+C to terminate a stuck program."}], 2, 'standard', 25),
        (1, 'Functions & Scope', 'Write reusable functions with parameters, return values, overloading, and understand variable scope.',
         [{"type": "heading", "content": "Functions in C++"},
          {"type": "text", "content": "Functions break your program into reusable, modular pieces. Every C++ program starts with `main()`, and you can define your own functions."},
          {"type": "heading", "content": "Defining Functions"},
          {"type": "code", "language": "cpp", "content": "#include <iostream>\nusing namespace std;\n\n// Function declaration (prototype)\nint add(int a, int b);\n\nint main() {\n    int result = add(5, 3);\n    cout << \"Sum: \" << result << endl;  // Sum: 8\n    return 0;\n}\n\n// Function definition\nint add(int a, int b) {\n    return a + b;\n}"},
          {"type": "heading", "content": "Parameters & Return Values"},
          {"type": "code", "language": "cpp", "content": "// Pass by value (default) — a copy is made\nvoid doubleValue(int x) { x *= 2; }\n\n// Pass by reference — original is modified\nvoid doubleRef(int& x) { x *= 2; }\n\nint main() {\n    int n = 10;\n    doubleValue(n);\n    cout << n << endl;  // 10 (unchanged)\n    doubleRef(n);\n    cout << n << endl;  // 20 (modified!)\n    return 0;\n}"},
          {"type": "heading", "content": "Default Arguments & Overloading"},
          {"type": "code", "language": "cpp", "content": "// Default arguments\nint multiply(int a, int b = 2) {\n    return a * b;\n}\n\n// Function overloading — same name, different parameters\nint max(int a, int b) { return (a > b) ? a : b; }\ndouble max(double a, double b) { return (a > b) ? a : b; }\n\nint main() {\n    cout << multiply(5) << endl;    // 10 (uses default b=2)\n    cout << multiply(5, 3) << endl; // 15\n    cout << max(10, 20) << endl;    // 20 (int version)\n    cout << max(3.14, 2.71) << endl; // 3.14 (double version)\n    return 0;\n}"},
          {"type": "callout", "variant": "info", "content": "Use **const reference** (`const string& s`) for large parameters you don't need to modify — it avoids copying and signals intent clearly."}], 3, 'standard', 25),
        (1, 'Arrays, Strings & Pointers', 'Work with arrays, C++ strings, and understand the basics of pointers and memory.',
         [{"type": "heading", "content": "Arrays, Strings & Pointers in C++"},
          {"type": "text", "content": "Arrays and strings store collections of data. Pointers give you direct access to memory — a powerful but dangerous C++ feature."},
          {"type": "heading", "content": "Arrays"},
          {"type": "code", "language": "cpp", "content": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Fixed-size array\n    int numbers[5] = {10, 20, 30, 40, 50};\n    numbers[2] = 99;\n\n    for (int i = 0; i < 5; i++) {\n        cout << \"numbers[\" << i << \"] = \" << numbers[i] << endl;\n    }\n\n    // 2D array\n    int matrix[2][3] = {{1,2,3}, {4,5,6}};\n    cout << matrix[1][2] << endl;  // 6\n    return 0;\n}"},
          {"type": "heading", "content": "C++ Strings"},
          {"type": "code", "language": "cpp", "content": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s1 = \"Hello\";\n    string s2 = \"World\";\n    string s3 = s1 + \" \" + s2;  // \"Hello World\"\n\n    cout << s3.length() << endl;       // 11\n    cout << s3.substr(0, 5) << endl;   // \"Hello\"\n    cout << s3.find(\"World\") << endl; // 6\n\n    for (char c : s3) cout << c << \"-\";\n    return 0;\n}"},
          {"type": "heading", "content": "Pointers"},
          {"type": "code", "language": "cpp", "content": "int value = 42;\nint* ptr = &value;   // ptr holds the address of value\n\ncout << ptr << endl;     // 0x7ff... (memory address)\ncout << *ptr << endl;    // 42 (dereference → get value)\n\n*ptr = 100;\ncout << value << endl;   // 100 (original changed!)\n\nint* safePtr = nullptr;\nif (safePtr != nullptr) {\n    cout << *safePtr;\n}"},
          {"type": "callout", "variant": "warning", "content": "**Always initialize pointers!** A dangling pointer (pointing to freed memory) causes undefined behavior — crashes, corruption, or security holes. Set to `nullptr` when not in use."},
          {"type": "heading", "content": "Dynamic Memory"},
          {"type": "code", "language": "cpp", "content": "int* arr = new int[10];  // Allocate on heap\narr[0] = 42;\ndelete[] arr;            // Must free! Or use vector\n\n// Modern C++: smart pointers (C++11+)\n#include <memory>\nauto ptr = make_unique<int>(42);\n// Automatically deleted when out of scope"}], 4, 'standard', 30),
        (2, 'Expressions and Equations', 'Learn to write and manipulate algebraic expressions and solve linear equations.',
         [{"type": "heading", "content": "Algebraic Expressions and Equations"},
          {"type": "text", "content": "Algebra is the branch of mathematics that uses symbols to represent numbers and quantities in formulas and equations."},
          {"type": "heading", "content": "Variables and Expressions"},
          {"type": "text", "content": "An algebraic expression combines numbers, variables, and operations. For example: **3x + 5** is an expression where **x** is the variable, **3** is the coefficient, and **5** is the constant."},
          {"type": "code", "language": "text", "content": "Expression: 3x + 5\n- 3 is the coefficient\n- x is the variable\n- 5 is the constant\n- + is the operator"},
          {"type": "heading", "content": "Solving Linear Equations"},
          {"type": "text", "content": "To solve an equation, isolate the variable on one side using inverse operations."},
          {"type": "code", "language": "text", "content": "Solve: 2x + 7 = 15\n\nStep 1: Subtract 7 from both sides\n2x + 7 - 7 = 15 - 7\n2x = 8\n\nStep 2: Divide both sides by 2\n2x/2 = 8/2\nx = 4\n\nCheck: 2(4) + 7 = 8 + 7 = 15 ✓"},
          {"type": "callout", "variant": "tip", "content": "Whatever operation you do to one side, you must do to the other. This keeps the equation balanced!"},
          {"type": "heading", "content": "Distributive Property"},
          {"type": "code", "language": "text", "content": "a(b + c) = ab + ac\n\nExample: 3(x + 4) = 3x + 12\n\nSolve: 3(x + 4) = 30\n3x + 12 = 30\n3x = 18\nx = 6"}], 1, 'standard', 20),
        (2, 'Linear Functions and Graphing', 'Understand slope, intercepts, and how to graph linear functions on the coordinate plane.',
         [{"type": "heading", "content": "Linear Functions and Graphing"},
          {"type": "text", "content": "A linear function creates a straight line when graphed. The standard form is **y = mx + b**."},
          {"type": "heading", "content": "Slope-Intercept Form"},
          {"type": "code", "language": "text", "content": "y = mx + b\n\nWhere:\nm = slope (rate of change)\nb = y-intercept (where line crosses y-axis)\n\nSlope = rise / run = (y2 - y1) / (x2 - x1)"},
          {"type": "text", "content": "A **positive slope** means the line goes upward from left to right. A **negative slope** means it goes downward."},
          {"type": "heading", "content": "Finding Slope"},
          {"type": "code", "language": "text", "content": "Points: (1, 3) and (4, 9)\n\nslope = (9 - 3) / (4 - 1)\nslope = 6 / 3\nslope = 2\n\nThe line rises 2 units for every 1 unit it moves right."},
          {"type": "callout", "variant": "info", "content": "A **horizontal line** has slope 0 (y = constant). A **vertical line** has undefined slope (x = constant)."},
          {"type": "heading", "content": "Graphing Steps"},
          {"type": "text", "content": "1. Plot the y-intercept (0, b)\n2. Use the slope to find another point (rise/run)\n3. Draw a line through both points\n4. Extend the line with arrows on both ends"}], 2, 'standard', 25),
        (2, 'Systems of Equations', 'Solve systems of linear equations using substitution, elimination, and graphing methods.',
         [{"type": "heading", "content": "Systems of Equations"},
          {"type": "text", "content": "A system of equations is a set of two or more equations with the same variables. The solution is the point(s) that satisfy **all** equations."},
          {"type": "heading", "content": "Solving by Substitution"},
          {"type": "code", "language": "text", "content": "System:\ny = 2x + 1\ny = -x + 7\n\nSince both equal y:\n2x + 1 = -x + 7\n3x + 1 = 7\n3x = 6\nx = 2\n\nSubstitute x = 2 into either equation:\ny = 2(2) + 1 = 5\n\nSolution: (2, 5)"},
          {"type": "heading", "content": "Solving by Elimination"},
          {"type": "code", "language": "text", "content": "System:\n2x + 3y = 12\n4x - 3y = 6\n\nAdd both equations (y terms cancel):\n6x = 18\nx = 3\n\nSubstitute x = 3:\n2(3) + 3y = 12\n6 + 3y = 12\n3y = 6\ny = 2\n\nSolution: (3, 2)"},
          {"type": "callout", "variant": "danger", "content": "Not all systems have a single solution! **Parallel lines** have no solution. **Coincident lines** have infinitely many solutions."}], 3, 'standard', 25),
        (3, "Newton's Laws of Motion", 'Learn the three fundamental laws that describe how objects move under the influence of forces.',
         [{"type": "heading", "content": "Newton's Laws of Motion"},
          {"type": "text", "content": "Sir Isaac Newton published his three laws of motion in 1687. These laws form the foundation of classical mechanics."},
          {"type": "heading", "content": "First Law — Law of Inertia"},
          {"type": "text", "content": "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, **unless** acted upon by an unbalanced force."},
          {"type": "code", "language": "text", "content": "Examples:\n- A hockey puck sliding on ice slows due to friction\n- A book on a table stays put unless you push it\n- You lurch forward in a car that stops suddenly"},
          {"type": "callout", "variant": "tip", "content": "**Inertia** is proportional to mass. Heavier objects have more inertia and are harder to start moving or stop."},
          {"type": "heading", "content": "Second Law — F = ma"},
          {"type": "text", "content": "The acceleration of an object is **directly proportional** to the net force and **inversely proportional** to its mass."},
          {"type": "code", "language": "text", "content": "F = ma\n\nWhere:\nF = net force (Newtons)\nm = mass (kg)\na = acceleration (m/s²)\n\nExample: A 5kg object accelerates at 3 m/s²\nF = 5 × 3 = 15 N"},
          {"type": "heading", "content": "Third Law — Action-Reaction"},
          {"type": "text", "content": "For every action, there is an **equal and opposite** reaction. Forces always come in pairs."},
          {"type": "code", "language": "text", "content": "Examples:\n- When you jump, you push down on Earth, Earth pushes you up\n- A rocket pushes exhaust gases down, gases push the rocket up\n- When walking, you push backward on ground, ground pushes you forward"}], 1, 'standard', 30),
        (3, 'Work, Energy, and Power', 'Understand the concepts of work, kinetic and potential energy, and the conservation of energy.',
         [{"type": "heading", "content": "Work, Energy, and Power"},
          {"type": "text", "content": "**Energy** is the ability to do work. **Work** is the transfer of energy through force applied over a distance."},
          {"type": "heading", "content": "Work"},
          {"type": "code", "language": "text", "content": "W = F × d × cos(θ)\n\nWhere:\nW = work (Joules)\nF = force (Newtons)\nd = displacement (meters)\nθ = angle between force and displacement\n\nIf force and displacement are in the same direction:\nW = F × d"},
          {"type": "text", "content": "Work is only done when a force causes **displacement**. Holding a heavy box stationary does no work — no displacement occurs."},
          {"type": "heading", "content": "Kinetic Energy"},
          {"type": "code", "language": "text", "content": "KE = ½mv²\n\nWhere:\nKE = kinetic energy (Joules)\nm = mass (kg)\nv = velocity (m/s)\n\nExample: A 2kg ball moving at 3 m/s\nKE = ½ × 2 × 3² = 9 J"},
          {"type": "heading", "content": "Potential Energy"},
          {"type": "code", "language": "text", "content": "PE = mgh\n\nWhere:\nPE = gravitational potential energy (Joules)\nm = mass (kg)\ng = 9.8 m/s²\nh = height (meters)\n\nExample: A 5kg object at 10m height\nPE = 5 × 9.8 × 10 = 490 J"},
          {"type": "callout", "variant": "info", "content": "**Conservation of Energy:** Energy cannot be created or destroyed, only converted from one form to another. In a closed system, total energy remains constant."},
          {"type": "heading", "content": "Power"},
          {"type": "code", "language": "text", "content": "P = W / t\n\nWhere:\nP = power (Watts)\nW = work (Joules)\nt = time (seconds)\n\n1 Watt = 1 Joule per second"}], 2, 'standard', 30),
        (3, 'Momentum and Collisions', 'Explore linear momentum, impulse, and conservation of momentum in elastic and inelastic collisions.',
         [{"type": "heading", "content": "Momentum and Collisions"},
          {"type": "text", "content": "**Momentum** is a measure of the quantity of motion. It depends on both mass and velocity."},
          {"type": "heading", "content": "Linear Momentum"},
          {"type": "code", "language": "text", "content": "p = mv\n\nWhere:\np = momentum (kg·m/s)\nm = mass (kg)\nv = velocity (m/s)\n\nExample: A 1000kg car at 20 m/s\np = 1000 × 20 = 20,000 kg·m/s"},
          {"type": "heading", "content": "Impulse"},
          {"type": "code", "language": "text", "content": "J = F × Δt = Δp\n\nWhere:\nJ = impulse (N·s)\nF = force (N)\nΔt = time interval (s)\nΔp = change in momentum\n\nExample: A 100N force applied for 0.5s\nJ = 100 × 0.5 = 50 N·s"},
          {"type": "text", "content": "Impulse explains why **airbags save lives** — they increase the time of impact, reducing the force experienced by the occupant."},
          {"type": "heading", "content": "Conservation of Momentum"},
          {"type": "code", "language": "text", "content": "In a closed system:\np_before = p_after\n\nElastic collision (objects bounce):\nm₁v₁i + m₂v₂i = m₁v₁f + m₂v₂f\n\nInelastic collision (objects stick):\nm₁v₁i + m₂v₂i = (m₁ + m₂)vf"},
          {"type": "callout", "data": {"type": "warning", "text": "In real-world collisions, some kinetic energy is always converted to heat and sound. Perfectly elastic collisions are idealizations that only approximately occur (e.g., billiard balls)."}}], 3, 'standard', 30),
    ]
    conn.executemany(
        "INSERT INTO lessons (course_id, title, description, content, \"order\", lesson_type, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [(c, t, d, json.dumps(co), o, lt, em) for c, t, d, co, o, lt, em in lessons]
    )
    conn.commit()


def _seed_exams_and_questions(conn: sqlite3.Connection):
    exams = [
        (1, None, 'C++ Fundamentals Final Exam', 'Test your overall understanding of C++ programming concepts — variables, control flow, functions, arrays, strings, and pointers.', 'course_exam', 60, 70, 1),
        (None, 1, 'Variables & I/O Quiz', 'Check your understanding of C++ variables, data types, and console I/O.', 'lesson_quiz', 10, 60, 1),
        (None, 2, 'Control Flow Quiz', 'Test your knowledge of conditionals, switch, and loops in C++.', 'lesson_quiz', 10, 60, 1),
        (None, 3, 'Functions Quiz', 'Check your understanding of C++ functions, parameters, and overloading.', 'lesson_quiz', 10, 60, 1),
        (None, 4, 'Arrays & Strings Quiz', 'Test your knowledge of arrays, C++ strings, and pointers.', 'lesson_quiz', 10, 60, 1),
        (2, None, 'Algebra Foundations Final Exam', 'Comprehensive test of your algebra skills.', 'course_exam', 60, 70, 1),
        (None, 5, 'Expressions Quiz', 'Check your understanding of expressions and equations.', 'lesson_quiz', 10, 60, 1),
        (None, 6, 'Graphing Quiz', 'Test your knowledge of linear functions and graphing.', 'lesson_quiz', 10, 60, 1),
        (None, 7, 'Systems Quiz', 'Check your understanding of systems of equations.', 'lesson_quiz', 10, 60, 1),
        (3, None, 'Classical Mechanics Final Exam', 'Comprehensive test of classical mechanics concepts.', 'course_exam', 60, 70, 1),
        (None, 8, "Newton's Laws Quiz", 'Check your understanding of Newton\'s three laws.', 'lesson_quiz', 10, 60, 1),
        (None, 9, 'Energy Quiz', 'Test your knowledge of work, energy, and power.', 'lesson_quiz', 10, 60, 1),
        (None, 10, 'Momentum Quiz', 'Check your understanding of momentum and collisions.', 'lesson_quiz', 10, 60, 1),
    ]
    conn.executemany(
        "INSERT INTO exams (course_id, lesson_id, title, description, exam_type, time_limit_minutes, passing_score, \"order\") VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        exams
    )
    conn.commit()

    all_options = {
        1: ['int x = 5;', 'int x = 5', 'x = 5;', 'let x = 5;'],
        2: ['sizeof()', 'length()', 'size()', 'count()'],
        3: ['4 bytes', '2 bytes', '8 bytes', '1 byte'],
        4: ['double', 'float', 'long', 'int'],
        5: ['int 1stValue = 10;', 'int _value = 10;', 'int my-value = 10;', 'int int = 10;'],
        6: ['cin >> name;', 'cin << name;', 'cout >> name;', 'read(name);'],
        7: ['int', 'float', 'char', 'bool'],
        8: ['break', 'continue', 'return', 'exit'],
        9: ['0 1 2 3 4', '1 2 3 4 5', '0 1 2 3 4 5', '1 2 3 4'],
        10: ['pass by reference', 'pass by value', 'pass by pointer', 'pass by address'],
        11: ['Declaration tells the compiler a function exists; definition provides its body', 'They are the same thing', 'Declaration includes the body; definition is just the name', 'Definition must come before main()'],
        12: ['5', '10', '2', '8'],
        13: ['new[]', 'alloc[]', 'malloc[]', 'create[]'],
        14: ['Attempting to access memory through a pointer to freed/deleted memory', 'A pointer that points to a null value', 'A very large pointer', 'A pointer to a different data type'],
        15: ['#include <vector>', '#include <list>', '#include <array>', '#include <string>'],
        16: ['x = 5', 'x = 7', 'x = 3', 'x = 15'],
        17: ['2', '-2', '5', '-5'],
        18: ['One', 'Infinite', 'None', 'Two'],
        19: ['x', '5', '-3', '5x'],
        20: ['x = 11', 'x = 5', 'x = -5', 'x = 24'],
        21: ['2x + 3', '2x + 6', 'x + 6', '2x + 5'],
        22: ['3', '-4', '4', '0'],
        23: ['Vertical', 'Horizontal', 'Diagonal', 'Curved'],
        24: ['2', '3', '4', '1'],
        25: ['x = 3, y = -2 is the solution', 'No solution', 'Infinite solutions', 'The system is broken'],
        26: ['(6, 4)', '(4, 6)', '(8, 2)', '(5, 5)'],
        27: ['One', 'No solution', 'Infinite solutions', 'Cannot determine'],
        28: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'],
        29: ['Newton', 'Joule', 'Watt', 'Pascal'],
        30: ['Objects bounce apart', 'Objects stick together', 'Objects pass through each other', 'Objects disappear'],
        31: ['Velocity', 'Acceleration', 'Mass', 'Force'],
        32: ['2 N', '15 N', '50 N', '5 N'],
        33: ['Gravity only', 'Normal force only', 'Gravity and normal force are balanced', 'No forces at all'],
        34: ['6 J', '12 J', '18 J', '36 J'],
        35: ['300 J', '3000 J', '60 J', '600 J'],
        36: ['50 W', '800 W', '40 W', '200 W'],
        37: ['2.5 kg·m/s', '10 kg·m/s', '7 kg·m/s', '3 kg·m/s'],
        38: ['60 N·s', '6.67 N·s', '23 N·s', '17 N·s'],
        39: ['Inelastic', 'Perfectly inelastic', 'Elastic', 'No collisions conserve KE'],
    }

    questions = [
        (1, 'Which syntax correctly declares and initializes an integer variable in C++?', 'int x = 5;', 'C++ requires both the type and a semicolon after the statement.', 2, 1),
        (1, 'Which operator returns the size of a data type in bytes?', 'sizeof()', 'sizeof() is a compile-time operator that returns the size in bytes.', 1, 2),
        (1, 'How many bytes does an int typically occupy on modern systems?', '4 bytes', 'On most modern systems, int is 4 bytes (32 bits).', 1, 3),
        (2, 'Which type should you use for a number with decimals in C++?', 'double', 'double is the standard choice for floating-point numbers in C++.', 1, 1),
        (2, 'Which of the following is NOT a valid C++ variable declaration?', 'int 1stValue = 10;', 'Variable names cannot start with a digit in C++.', 1, 2),
        (2, 'How do you read a string from the console into a variable called name?', 'cin >> name;', 'cin >> extracts data from the input stream. Use getline(cin, name) for multi-word input.', 1, 3),
        (3, 'What is the default value of an uninitialized local int variable in C++?', 'Undefined (garbage value)', 'C++ does not auto-initialize local variables — they contain whatever was in memory.', 1, 1),
        (3, 'What keyword is used to exit a switch case early?', 'break', 'Without break, execution falls through to the next case.', 1, 2),
        (3, 'What does the following loop print: for (int i = 0; i < 5; i++) cout << i << " ";', '0 1 2 3 4', 'The loop runs while i < 5, printing 0 through 4.', 1, 3),
        (4, 'What does a function parameter declared as int& x mean?', 'pass by reference', 'The & means the parameter is a reference — modifications affect the original argument.', 1, 1),
        (4, 'What is the difference between a function declaration and definition?', 'Declaration tells the compiler a function exists; definition provides its body', 'Declarations go in headers; definitions provide the actual implementation.', 1, 2),
        (4, 'What does the following return: int add(int a, int b = 2) { return a + b; } add(3);', '5', 'Default arguments are used when not provided: 3 + 2 = 5.', 1, 3),
        (5, 'Which keyword is used to allocate dynamic memory in C++?', 'new', 'new allocates memory on the heap. The corresponding deallocation is delete.', 1, 1),
        (5, 'What is a dangling pointer?', 'Attempting to access memory through a pointer to freed/deleted memory', 'After delete/free, the pointer still holds the old address — dereferencing it is undefined behavior.', 1, 2),
        (5, 'Which header is needed to use std::vector?', '#include <vector>', 'std::vector is defined in the <vector> header.', 1, 3),
        (6, 'Solve for x: 3x + 7 = 22', 'x = 5', '3x + 7 = 22 → 3x = 15 → x = 5.', 2, 1),
        (6, 'What is the slope of the line y = -2x + 5?', '-2', 'In y = mx + b, m is the slope. Here m = -2.', 1, 2),
        (6, 'How many solutions does a system of parallel lines have?', 'None', 'Parallel lines never intersect, so there is no solution.', 1, 3),
        (7, 'What is the coefficient in the expression 5x - 3?', '5', 'The coefficient is the number multiplied by the variable, which is 5.', 1, 1),
        (7, 'Solve: x - 8 = 3', 'x = 11', 'x - 8 = 3 → x = 3 + 8 → x = 11.', 1, 2),
        (7, 'Simplify: 2(x + 3)', '2x + 6', '2(x + 3) = 2x + 6 using the distributive property.', 1, 3),
        (8, 'What is the y-intercept of y = 3x - 4?', '-4', 'In y = mx + b, b is the y-intercept. Here b = -4.', 1, 1),
        (8, 'What type of line has a slope of 0?', 'Horizontal', 'A horizontal line has slope 0.', 1, 2),
        (8, 'Find the slope between (2, 4) and (6, 12)', '2', 'slope = (12-4)/(6-2) = 8/4 = 2.', 1, 3),
        (9, 'What does it mean when two lines intersect at (3, -2)?', 'x = 3, y = -2 is the solution', 'The intersection point is the solution.', 1, 1),
        (9, 'Solve by elimination: x + y = 10, x - y = 2', '(6, 4)', 'Adding: 2x = 12 → x = 6. Then 6 + y = 10 → y = 4.', 1, 2),
        (9, 'What does it mean if both equations in a system simplify to the same line?', 'Infinite solutions', 'If both equations represent the same line, every point is a solution.', 1, 3),
        (10, "Which of Newton's laws explains why a rocket works?", 'Third Law', 'The Third Law (action-reaction) explains rockets.', 2, 1),
        (10, 'What is the SI unit of work?', 'Joule', 'Work is measured in Joules (N·m).', 1, 2),
        (10, 'In a perfectly inelastic collision, what happens?', 'Objects stick together', 'In a perfectly inelastic collision, the objects stick together.', 1, 3),
        (11, 'What is inertia proportional to?', 'Mass', 'Inertia is directly proportional to mass.', 1, 1),
        (11, 'A 10 kg object accelerates at 5 m/s². What is the net force?', '50 N', 'F = ma = 10 × 5 = 50 N.', 1, 2),
        (11, 'What forces are acting on a book resting on a table?', 'Gravity and normal force are balanced', 'Gravity pulls down, the table pushes up with an equal normal force.', 1, 3),
        (12, 'What is the kinetic energy of a 4 kg object moving at 3 m/s?', '18 J', 'KE = ½ × 4 × 3² = 18 J.', 1, 1),
        (12, 'A 60 kg person climbs 5 meters. What is their potential energy gain? (g = 10 m/s²)', '3000 J', 'PE = mgh = 60 × 10 × 5 = 3000 J.', 1, 2),
        (12, 'What is power if 200 J of work is done in 4 seconds?', '50 W', 'P = W/t = 200/4 = 50 W.', 1, 3),
        (13, 'What is the momentum of a 5 kg object moving at 2 m/s?', '10 kg·m/s', 'p = mv = 5 × 2 = 10 kg·m/s.', 1, 1),
        (13, 'If a force of 20 N is applied for 3 seconds, what is the impulse?', '60 N·s', 'J = F × Δt = 20 × 3 = 60 N·s.', 1, 2),
        (13, 'In which collision type is kinetic energy conserved?', 'Elastic', 'In elastic collisions, both momentum and kinetic energy are conserved.', 1, 3),
    ]
    conn.executemany(
        "INSERT INTO questions (exam_id, question_text, correct_answer, explanation, points, \"order\") VALUES (?, ?, ?, ?, ?, ?)",
        questions
    )
    conn.commit()
    # Update options and question_type for all questions
    all_rows = conn.execute('SELECT "rowid", "id" FROM "questions"').fetchall()
    for i, row in enumerate(all_rows):
        qid = row["id"]
        opts = json.dumps(all_options.get(i + 1, []))
        conn.execute('UPDATE "questions" SET "options" = ?, "question_type" = ? WHERE "id" = ?', [opts, 'multiple_choice', qid])
    conn.commit()
    conn.commit()
