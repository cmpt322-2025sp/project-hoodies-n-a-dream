/**
 * File: backend/src/services/mathServices
 * Author: Tim Xu (Original), Connor Vardakis (Modified)
 * Date: 2/26/25
 * Updated: 3/3/25
 * Description: mathServices generates question sets based on selected difficulty level
 */
import {generateRandomMathQuestion} from "../controllers/mathController.ts";

type QuizQuestion = {
    id: number;
    question: string;
    correct_answer: number;
    incorrect_answers: number[];
};

export function getQuestions(difficutly: string): QuizQuestion[] {
    // This will hold all 100 questions
    const questions: QuizQuestion[] = [];

    switch (difficutly) {

        case "easy": {
            const oneDigitAddition = generateQuestions("addition", 1, 20);
            questions.push(...oneDigitAddition);
            return generateFinalOutput(questions);
        }

        case "medium": {
            const oneDigitSubtraction = generateQuestions("subtraction", 1, 20);
            questions.push(...oneDigitSubtraction);
            return generateFinalOutput(questions);
        }

        case "hard": {
            const twoDigitAddition = generateQuestions("addition", 2, 10);
            questions.push(...twoDigitAddition);


            const twoDigitSubtraction = generateQuestions("subtraction", 2, 10);
            questions.push(...twoDigitSubtraction);
            return generateFinalOutput(questions);
        }

        default:
            console.error("[ERROR] Invalid difficulty: ", difficutly);
    }

    // 2) 20 one-digit subtractions


    // 3) 20 two-digit additions


    // 5) 20 multiplications (digits parameter is ignored in multiplication, but we pass something anyway)
    // const multiplicationSet = generateQuestions("multiplication", 1, 20);
    // questions.push(...multiplicationSet);
    //
    // // Now we have 100 questions total. Assign IDs from 1..100

}

function generateFinalOutput(questions: QuizQuestion[]): QuizQuestion[] {
    questions.forEach((q, index) => {
        q.id = index + 1;
    });

    return questions;
    // const finalOutput = { questions };

    // Print it with custom formatting so that
    // - "incorrect_answers" is on one line
    // - everything else is nicely spaced
    //
    // However, standard JSON.stringify won't by default keep arrays on one line.
    // If you absolutely want "incorrect_answers" to appear on one line,
    // you can do a custom replacer or post-process the string.
    //
    // We'll do a basic pretty-print here:
    // console.log(JSON.stringify(finalOutput, null, 2));
    // return JSON.stringify(finalOutput);
}

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
            question: q.question,
            correct_answer: q.answer,
            incorrect_answers: q.wrongAnswers,
        });
    }
    return result;
}
