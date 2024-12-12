export default function censorReviewRegex(review) {
    const censoredWords = ["dcmm", "cc", "clmm", "hùng chó điên", "đụ má", "thằng chó"];
    const regex = new RegExp(`\\b(${censoredWords.join("|")})\\b`, "gi");
    return review.replace(regex, match => "*".repeat(match.length));
}
