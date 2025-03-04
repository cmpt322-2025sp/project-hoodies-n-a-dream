export type MathQuestion = {
    question: string;        // e.g. "8 + 7"
    answer: number;          // e.g. 15
    wrongAnswers: number[];  // e.g. [11, 18, 19]
};

export function generateRandomMathQuestion(
    operator: "addition" | "subtraction" | "multiplication",
    digits: 1 | 2
): MathQuestion {
    let a: number;
    let b: number;
    let questionStr: string;
    let answerVal: number;

    // Helper to get a random integer in [min, max]
    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate 3 "close" but distinct wrong answers
    function generateCloseWrongAnswers(
        correctAnswer: number,
        minValue = 0,
        maxValue = 400
    ): number[] {
        // Offsets around the correct answer (±1..±5)
        const offsets = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

        // Shuffle offsets (Fisher-Yates)
        for (let i = offsets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
        }

        const results: number[] = [];
        for (const offset of offsets) {
            const candidate = correctAnswer + offset;
            if (
                candidate >= minValue &&
                candidate <= maxValue &&
                candidate !== correctAnswer
            ) {
                results.push(candidate);
            }
            if (results.length === 3) {
                break;
            }
        }
        return results;
    }

    // 1) Addition/Subtraction
    if (operator === "addition" || operator === "subtraction") {
        // digits=1 => [1..9], digits=2 => [10..99]
        const min = digits === 1 ? 1 : 10;
        const max = digits === 1 ? 9 : 99;
        a = randomInt(min, max);
        b = randomInt(min, max);

        if (operator === "addition") {
            questionStr = `${a} + ${b}`;
            answerVal = a + b;
        } else {
            // Subtraction
            // Ensure non-negative result for elementary-level subtraction
            if (b > a) {
                [a, b] = [b, a];
            }
            questionStr = `${a} - ${b}`;
            answerVal = a - b;
        }

        // 2) Multiplication
    } else {
        // Multiplication up to 19×19
        a = randomInt(1, 19);
        b = randomInt(1, 19);
        questionStr = `${a} × ${b}`;
        answerVal = a * b;
    }

    // Generate the wrong answers
    const wrongAnswers = generateCloseWrongAnswers(answerVal);

    return {
        question: questionStr,
        answer: answerVal,
        wrongAnswers,
    };
}