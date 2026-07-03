// JSON schemas for Claude structured outputs (output_config.format).
// Every object sets additionalProperties: false and lists all properties in
// `required`, per the structured-outputs schema restrictions.

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["candidate_profile", "role_profile", "question_plan"],
  properties: {
    candidate_profile: {
      type: "object",
      additionalProperties: false,
      required: ["summary", "experience", "skills", "gaps"],
      properties: {
        summary: {
          type: "string",
          description: "2-3 sentence overview of the candidate's background"
        },
        experience: {
          type: "array",
          items: { type: "string" },
          description: "Key roles/accomplishments pulled from the resume"
        },
        skills: {
          type: "array",
          items: { type: "string" },
          description: "Concrete skills evidenced in the resume"
        },
        gaps: {
          type: "array",
          items: { type: "string" },
          description: "Gaps relative to this specific job: missing skills, thin experience, unexplained transitions"
        }
      }
    },
    role_profile: {
      type: "object",
      additionalProperties: false,
      required: ["title", "requirements", "competencies", "red_flags"],
      properties: {
        title: {
          type: "string",
          description: "Job title, plus company name if present in the description"
        },
        requirements: {
          type: "array",
          items: { type: "string" },
          description: "Hard requirements from the job description"
        },
        competencies: {
          type: "array",
          items: { type: "string" },
          description: "Competencies an interviewer for this role would probe (stated or implied)"
        },
        red_flags: {
          type: "array",
          items: { type: "string" },
          description: "Things an interviewer for this role would treat as red flags in answers"
        }
      }
    },
    question_plan: {
      type: "array",
      description: "8-10 planned interview questions, ordered as a real interview would flow",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["topic", "type", "rationale"],
        properties: {
          topic: {
            type: "string",
            description: "Short label for what the question probes, e.g. 'Conflict resolution with stakeholders'"
          },
          type: {
            type: "string",
            enum: ["behavioral", "technical", "situational"]
          },
          rationale: {
            type: "string",
            description: "Why this question matters for THIS candidate and THIS job (tie to a requirement, competency, or gap)"
          }
        }
      }
    }
  }
};

const interviewTurnSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message", "question_number", "is_followup", "interview_complete"],
  properties: {
    message: {
      type: "string",
      description: "What the interviewer says next, verbatim"
    },
    question_number: {
      type: "integer",
      description: "Which planned question (1-based) this turn belongs to; use the last question's number on the closing turn"
    },
    is_followup: {
      type: "boolean",
      description: "True when this message is a follow-up probe rather than a new planned question"
    },
    interview_complete: {
      type: "boolean",
      description: "True only on the final closing message, after all planned questions are done or the candidate ended early"
    }
  }
};

const feedbackSchema = {
  type: "object",
  additionalProperties: false,
  required: ["per_question", "overall"],
  properties: {
    per_question: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "type", "strengths", "weaknesses", "stronger_answer"],
        properties: {
          question: {
            type: "string",
            description: "The question as asked (condensed if long); fold follow-ups into their parent question"
          },
          type: {
            type: "string",
            enum: ["behavioral", "technical", "situational"]
          },
          strengths: {
            type: "array",
            items: { type: "string" },
            description: "What worked in the candidate's answer, specific to what they actually said"
          },
          weaknesses: {
            type: "array",
            items: { type: "string" },
            description: "What fell short, and what the interviewer was actually listening for"
          },
          stronger_answer: {
            type: "string",
            description: "A concise example of a stronger answer, built from the candidate's real background — never invented achievements"
          }
        }
      }
    },
    overall: {
      type: "object",
      additionalProperties: false,
      required: ["summary", "top_strengths", "top_priorities"],
      properties: {
        summary: {
          type: "string",
          description: "3-5 sentence overall read on the interview, warm but honest"
        },
        top_strengths: {
          type: "array",
          items: { type: "string" }
        },
        top_priorities: {
          type: "array",
          items: { type: "string" },
          description: "The 2-4 highest-leverage things to work on before the real interview"
        }
      }
    }
  }
};

const patternsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["patterns", "overall_trajectory"],
  properties: {
    patterns: {
      type: "array",
      description: "Recurring struggle or strength patterns across sessions; empty if there isn't enough evidence yet",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "evidence", "why_it_happens", "how_to_fix"],
        properties: {
          title: {
            type: "string",
            description: "Short name for the pattern, e.g. 'Conflict-resolution questions'"
          },
          evidence: {
            type: "string",
            description: "Concrete cross-session evidence with counts, e.g. 'You stumbled on conflict-resolution questions in 3 of your last 4 mocks'"
          },
          why_it_happens: {
            type: "string",
            description: "The likely root cause, inferred from the feedback details"
          },
          how_to_fix: {
            type: "string",
            description: "Specific, practicable fix the candidate can apply before the next interview"
          }
        }
      }
    },
    overall_trajectory: {
      type: "string",
      description: "How the candidate is trending across sessions; if there is too little data for patterns, say so plainly here"
    }
  }
};

module.exports = { analysisSchema, interviewTurnSchema, feedbackSchema, patternsSchema };
