
import { generateRandomMathQuestion } from "/Users/timxu/project-hoodies-n-a-dream/Backend/src/controllers/mathcontroller.ts";

type QuizQuestion = {
    id: number;
    question: string;
    correct_answer: number;
    incorrect_answers: number[];
};

function main() {
    // This will hold all 100 questions
    const questions: QuizQuestion[] = [];

    // Helper to generate a specific set of N questions for the chosen operator & digit setup
    function generateQuestions(
        operator: "addition" | "subtraction" | "multiplication",
        digits: 1 | 2,
        count: number
    ) {
        const result: QuizQuestion[] = [];
        for (let i = 0; i < count; i++) {
            const q = generateRandomMathQuestion(operator, digits);
            result.push({
                id: 0, // We'll assign IDs later
                question: q.question + " = ?",
                correct_answer: q.answer,
                incorrect_answers: q.wrongAnswers,
            });
        }
        return result;
    }

    // 1) 20 one-digit additions
    const oneDigitAddition = generateQuestions("addition", 1, 20);
    questions.push(...oneDigitAddition);

    // 2) 20 one-digit subtractions
    const oneDigitSubtraction = generateQuestions("subtraction", 1, 20);
    questions.push(...oneDigitSubtraction);

    // 3) 20 two-digit additions
    const twoDigitAddition = generateQuestions("addition", 2, 20);
    questions.push(...twoDigitAddition);

    // 4) 20 two-digit subtractions
    const twoDigitSubtraction = generateQuestions("subtraction", 2, 20);
    questions.push(...twoDigitSubtraction);

    // 5) 20 multiplications (digits parameter is ignored in multiplication, but we pass something anyway)
    const multiplicationSet = generateQuestions("multiplication", 1, 20);
    questions.push(...multiplicationSet);

    // Now we have 100 questions total. Assign IDs from 1..100
    questions.forEach((q, index) => {
        q.id = index + 1;
    });

    // Build the final JSON object
    const finalOutput = { questions };

    // Print it with custom formatting so that
    // - "incorrect_answers" is on one line
    // - everything else is nicely spaced
    //
    // However, standard JSON.stringify won't by default keep arrays on one line.
    // If you absolutely want "incorrect_answers" to appear on one line,
    // you can do a custom replacer or post-process the string.
    //
    // We'll do a basic pretty-print here:
    console.log(JSON.stringify(finalOutput, null, 2));
}

main();