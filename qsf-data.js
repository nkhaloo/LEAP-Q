// Generated from LEAP-Q_full.qsf. Run python3 scripts/build-questionnaire.py after source changes.
globalThis.LEAPQ_SOURCE = {
  "name": "LEAP-Q (full)",
  "surveyId": "SV_2mgBwGk76i6HIdD",
  "options": {
    "BackButton": "false",
    "SaveAndContinue": "true",
    "ProgressBarDisplay": "None",
    "NextButton": " → ",
    "PartialData": "+1 week"
  },
  "pages": [
    {
      "loop": false,
      "questions": [
        "QID2",
        "QID3",
        "QID4",
        "QID5"
      ]
    },
    {
      "loop": false,
      "questions": [
        "QID6",
        "QID7",
        "QID8",
        "QID9",
        "QID10",
        "QID11",
        "QID43",
        "QID44",
        "QID12"
      ]
    },
    {
      "loop": true,
      "questions": [
        "QID21",
        "QID22",
        "QID23",
        "QID24",
        "QID39",
        "QID38",
        "QID25",
        "QID40",
        "QID41",
        "QID42"
      ]
    }
  ],
  "questions": {
    "QID22": {
      "QuestionID": "QID22",
      "QuestionText": "Age when you...",
      "QuestionType": "TE",
      "Selector": "FORM",
      "Choices": {
        "1": {
          "Display": "began acquiring ${lm://Field/1}",
          "InputHeight": 29,
          "InputWidth": 100,
          "TextEntry": "on"
        },
        "2": {
          "Display": "became fluent in ${lm://Field/1}",
          "InputHeight": 29,
          "InputWidth": 100,
          "TextEntry": "on"
        },
        "3": {
          "Display": "began reading in ${lm://Field/1}",
          "InputHeight": 29,
          "InputWidth": 100,
          "TextEntry": "on"
        },
        "4": {
          "Display": "became fluent reading in ${lm://Field/1}",
          "InputHeight": 29,
          "InputWidth": 100,
          "TextEntry": "on"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q22"
    },
    "QID43": {
      "QuestionID": "QID43",
      "QuestionText": "Date of immigration to the USA, if applicable",
      "QuestionType": "TE",
      "Selector": "SL",
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q25"
    },
    "QID12": {
      "QuestionID": "QID12",
      "QuestionText": "Have you ever had a _______? (Check all applicable.) If yes, please explain (including any corrections):",
      "QuestionType": "MC",
      "Selector": "MAVR",
      "Choices": {
        "1": {
          "Display": "vision problem",
          "TextEntry": "true",
          "InputHeight": 24,
          "InputWidth": 391
        },
        "2": {
          "Display": "hearing impairment",
          "TextEntry": "true",
          "InputHeight": 24,
          "InputWidth": 361
        },
        "3": {
          "Display": "language disability",
          "TextEntry": "true",
          "InputHeight": 24,
          "InputWidth": 367
        },
        "4": {
          "Display": "learning disability",
          "TextEntry": "true",
          "InputHeight": 24,
          "InputWidth": 373
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q12"
    },
    "QID10": {
      "QuestionID": "QID10",
      "QuestionText": "How many years of formal education do you have?",
      "QuestionType": "TE",
      "Selector": "SL",
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "ContentType",
          "ContentType": "ValidNumber",
          "ValidDateType": "DateWithFormat",
          "ValidPhoneType": "ValidUSPhone",
          "ValidZipType": "ValidUSZip"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "InputWidth": 120,
        "InputHeight": 29,
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q10"
    },
    "QID2": {
      "QuestionID": "QID2",
      "QuestionText": "How old are you?",
      "QuestionType": "TE",
      "Selector": "SL",
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false",
        "InputWidth": 111,
        "InputHeight": 29
      },
      "DataExportTag": "Q2"
    },
    "QID44": {
      "QuestionID": "QID44",
      "QuestionText": "If you have ever immigrated to another country, please provide name of country and date of immigration here.",
      "QuestionType": "TE",
      "Selector": "SL",
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q26"
    },
    "QID41": {
      "QuestionID": "QID41",
      "QuestionText": "In your perception, how much of a foreign accent do you have in&nbsp;${lm://Field/1}?",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "0 - none"
        },
        "2": {
          "Display": "1 - almost none"
        },
        "3": {
          "Display": "2 - very light"
        },
        "4": {
          "Display": "3 - light"
        },
        "5": {
          "Display": "4 - some"
        },
        "6": {
          "Display": "5 - moderate"
        },
        "7": {
          "Display": "6 - considerable"
        },
        "8": {
          "Display": "7 - heavy"
        },
        "9": {
          "Display": "8 - very heavy"
        },
        "10": {
          "Display": "9 - extremely heavy"
        },
        "11": {
          "Display": "10 - pervasive"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q41"
    },
    "QID25": {
      "QuestionID": "QID25",
      "QuestionText": "On a scale from zero to ten, please select how much of the following factors contributed to you learning&nbsp;${lm://Field/1}:",
      "QuestionType": "Slider",
      "Selector": "HSLIDER",
      "Choices": {
        "1": {
          "Display": "Interacting with friends"
        },
        "2": {
          "Display": "Interacting with family"
        },
        "3": {
          "Display": "Reading"
        },
        "4": {
          "Display": "Language apps or websites/self instruction"
        },
        "5": {
          "Display": "Watching TV"
        },
        "6": {
          "Display": "Listening to radio/music"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "CSSliderMin": 0,
        "CSSliderMax": 10,
        "GridLines": 10,
        "SnapToGrid": false,
        "NumDecimals": "0",
        "ShowValue": false,
        "CustomStart": true,
        "SliderStartPositions": {
          "1": 0.4976635514018692,
          "2": 0.4976635514018692,
          "3": 0.4953271028037383,
          "4": 0.4953271028037383,
          "5": 0.4953271028037383,
          "6": 0.4953271028037383
        },
        "NotApplicable": false,
        "MobileFirst": true
      },
      "Labels": {
        "1": {
          "Display": "<div style=\"text-align: left;\">not a contributor</div>"
        },
        "2": {
          "Display": "<div style=\"text-align: center;\">moderate contributor</div>"
        },
        "3": {
          "Display": "<div style=\"text-align: right;\">most important contributor</div>"
        }
      },
      "DataExportTag": "Q25"
    },
    "QID38": {
      "QuestionID": "QID38",
      "QuestionText": "On a scale from zero to ten, please select your level of <strong>proficiency</strong> in reading ${lm://Field/1}:",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "0 - none"
        },
        "2": {
          "Display": "1 - very low"
        },
        "3": {
          "Display": "2 - low"
        },
        "4": {
          "Display": "3 - fair"
        },
        "5": {
          "Display": "4 - slightly less than adequate"
        },
        "6": {
          "Display": "5 - adequate"
        },
        "7": {
          "Display": "6 - slightly more than adequate"
        },
        "8": {
          "Display": "7 - good"
        },
        "9": {
          "Display": "8 - very good"
        },
        "10": {
          "Display": "9 - excellent"
        },
        "11": {
          "Display": "10 - perfect"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q38"
    },
    "QID24": {
      "QuestionID": "QID24",
      "QuestionText": "On a scale from zero to ten, please select your level of <strong>proficiency</strong> in speaking ${lm://Field/1}:",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "0 - none"
        },
        "2": {
          "Display": "1 - very low"
        },
        "3": {
          "Display": "2 - low"
        },
        "4": {
          "Display": "3 - fair"
        },
        "5": {
          "Display": "4 - slightly less than adequate"
        },
        "6": {
          "Display": "5 - adequate"
        },
        "7": {
          "Display": "6 - slightly more than adequate"
        },
        "8": {
          "Display": "7 - good"
        },
        "9": {
          "Display": "8 - very good"
        },
        "10": {
          "Display": "9 - excellent"
        },
        "11": {
          "Display": "10 - perfect"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q24"
    },
    "QID39": {
      "QuestionID": "QID39",
      "QuestionText": "On a scale from zero to ten, please select your level of <strong>proficiency</strong> in understanding spoken language ${lm://Field/1}:",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "0 - none"
        },
        "2": {
          "Display": "1 - very low"
        },
        "3": {
          "Display": "2 - low"
        },
        "4": {
          "Display": "3 - fair"
        },
        "5": {
          "Display": "4 - slightly less than adequate"
        },
        "6": {
          "Display": "5 - adequate"
        },
        "7": {
          "Display": "6 - slightly more than adequate"
        },
        "8": {
          "Display": "7 - good"
        },
        "9": {
          "Display": "8 - very good"
        },
        "10": {
          "Display": "9 - excellent"
        },
        "11": {
          "Display": "10 - perfect"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q39"
    },
    "QID11": {
      "QuestionID": "QID11",
      "QuestionText": "Please check your highest education level (or the approximate U equivalent to a degree obtained in another country):",
      "QuestionType": "MC",
      "Selector": "MAVR",
      "Choices": {
        "1": {
          "Display": "Less than High School"
        },
        "2": {
          "Display": "High School"
        },
        "3": {
          "Display": "Professional Training"
        },
        "4": {
          "Display": "Some College"
        },
        "5": {
          "Display": "College"
        },
        "6": {
          "Display": "Some Graduate School"
        },
        "7": {
          "Display": "Masters"
        },
        "8": {
          "Display": "Ph.D./M.D./J.D."
        },
        "9": {
          "Display": "Other:",
          "TextEntry": "true"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q11"
    },
    "QID4": {
      "QuestionID": "QID4",
      "QuestionText": "Please list all the languages you know <strong>in order of dominance</strong>:",
      "QuestionType": "TE",
      "Selector": "FORM",
      "Choices": {
        "1": {
          "Display": "1",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136,
          "TextEntryLength": "Medium"
        },
        "2": {
          "Display": "2",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136,
          "TextEntryLength": "Medium"
        },
        "3": {
          "Display": "3",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136,
          "TextEntryLength": "Medium"
        },
        "4": {
          "Display": "4",
          "InputHeight": 29,
          "InputWidth": 137,
          "TextEntry": "on"
        },
        "5": {
          "Display": "5",
          "InputHeight": 29,
          "InputWidth": 138,
          "TextEntry": "on"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "CustomValidation",
          "CustomValidation": {
            "Logic": {
              "0": {
                "0": {
                  "QuestionID": "QID4",
                  "QuestionIsInLoop": "no",
                  "ChoiceLocator": "q://QID4/ChoiceTextEntryValue/1",
                  "Operator": "NotEmpty",
                  "QuestionIDFromLocator": "QID4",
                  "LeftOperand": "q://QID4/ChoiceTextEntryValue/1",
                  "Type": "Expression",
                  "LogicType": "Question",
                  "Description": "<span class=\"ConjDesc\">If</span> <span class=\"QuestionDesc\">Please list all the languages you know in order of dominance:</span> <span class=\"LeftOpDesc\">1</span> <span class=\"OpDesc\">Is Not Empty</span> "
                },
                "Type": "If"
              },
              "Type": "BooleanExpression"
            },
            "Message": {
              "messageID": "MS_2lZMRQqUaqQrIH3",
              "subMessageID": "VE_FORCE_RESPONSE_OTHER",
              "libraryID": "UR_0PzaI4bcyDkTDc9",
              "description": "Require entry in text box"
            }
          }
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q4"
    },
    "QID5": {
      "QuestionID": "QID5",
      "QuestionText": "Please list all the languages you know&nbsp;<span style=\"font-weight: 700;\">in order of acquisition</span>:",
      "QuestionType": "TE",
      "Selector": "FORM",
      "Choices": {
        "1": {
          "Display": "1",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136
        },
        "2": {
          "Display": "2",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136
        },
        "3": {
          "Display": "3",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 136
        },
        "4": {
          "Display": "4",
          "InputHeight": 29,
          "InputWidth": 137,
          "TextEntry": "on"
        },
        "5": {
          "Display": "5",
          "InputHeight": 29,
          "InputWidth": 137,
          "TextEntry": "on"
        }
      },
      "ChoiceOrder": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "CustomValidation",
          "CustomValidation": {
            "Logic": {
              "0": {
                "0": {
                  "QuestionID": "QID5",
                  "QuestionIsInLoop": "no",
                  "ChoiceLocator": "q://QID5/ChoiceTextEntryValue/1",
                  "Operator": "NotEmpty",
                  "QuestionIDFromLocator": "QID5",
                  "LeftOperand": "q://QID5/ChoiceTextEntryValue/1",
                  "Type": "Expression",
                  "LogicType": "Question",
                  "Description": "<span class=\"ConjDesc\">If</span> <span class=\"QuestionDesc\">Please list all the languages you know&nbsp;in order of acquisition:</span> <span class=\"LeftOpDesc\">1</span> <span class=\"OpDesc\">Is Not Empty</span> "
                },
                "Type": "If"
              },
              "Type": "BooleanExpression"
            },
            "Message": {
              "messageID": "MS_2lZMRQqUaqQrIH3",
              "subMessageID": "VE_FORCE_RESPONSE_OTHER",
              "libraryID": "UR_0PzaI4bcyDkTDc9",
              "description": "Require entry in text box"
            }
          }
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q5"
    },
    "QID23": {
      "QuestionID": "QID23",
      "QuestionText": "Please list the amount of time you spent in each language environment (specify years, months):",
      "QuestionType": "TE",
      "Selector": "FORM",
      "Choices": {
        "1": {
          "Display": "A country where ${lm://Field/1} is spoken",
          "TextEntry": "on",
          "InputHeight": 34,
          "InputWidth": 100
        },
        "2": {
          "Display": "A family where ${lm://Field/1} is spoken",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 100
        },
        "3": {
          "Display": "A school and/or working environment where ${lm://Field/1} is spoken",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 100
        }
      },
      "ChoiceOrder": [
        "1",
        "2",
        "3"
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": null
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q23"
    },
    "QID6": {
      "QuestionID": "QID6",
      "QuestionText": "Please list what percentage of time you are <strong>currently and on average</strong> exposed to each of the languages you listed.",
      "QuestionType": "CS",
      "Selector": "VRTL",
      "Choices": {
        "1": {
          "Display": "${q://QID4/ChoiceTextEntryValue/1}"
        },
        "2": {
          "Display": "${q://QID4/ChoiceTextEntryValue/2}"
        },
        "3": {
          "Display": "${q://QID4/ChoiceTextEntryValue/3}"
        },
        "4": {
          "Display": "${q://QID4/ChoiceTextEntryValue/4}"
        },
        "5": {
          "Display": "${q://QID4/ChoiceTextEntryValue/5}"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "EnforceRange": "OFF",
          "Type": "ChoicesTotal",
          "ChoiceTotal": "100"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "Labels": [],
      "ClarifyingSymbol": "%",
      "DataExportTag": "Q6"
    },
    "QID9": {
      "QuestionID": "QID9",
      "QuestionText": "Please name the cultures with which you identify. (Examples of possible cultures include US-American, Chinese, Jewish-Orthodox, etc.)",
      "QuestionType": "TE",
      "Selector": "FORM",
      "Choices": {
        "1": {
          "Display": "Culture 1",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 161
        },
        "2": {
          "Display": "Culture 2",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 161
        },
        "3": {
          "Display": "Culture 3",
          "TextEntry": "on",
          "InputHeight": 29,
          "InputWidth": 161
        },
        "4": {
          "Display": "Culture 4",
          "InputHeight": 29,
          "InputWidth": 161,
          "TextEntry": "on"
        },
        "5": {
          "Display": "Culture 5",
          "InputHeight": 29,
          "InputWidth": 161,
          "TextEntry": "on"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "CustomValidation",
          "CustomValidation": {
            "Logic": {
              "0": {
                "0": {
                  "QuestionID": "QID9",
                  "QuestionIsInLoop": "no",
                  "ChoiceLocator": "q://QID9/ChoiceTextEntryValue/1",
                  "Operator": "NotEmpty",
                  "QuestionIDFromLocator": "QID9",
                  "LeftOperand": "q://QID9/ChoiceTextEntryValue/1",
                  "Type": "Expression",
                  "LogicType": "Question",
                  "Description": "<span class=\"ConjDesc\">If</span> <span class=\"QuestionDesc\">Please name the cultures with which you identify. (Examples of possible cultures include US-Ameri...</span> <span class=\"LeftOpDesc\">Culture 1</span> <span class=\"OpDesc\">Is Not Empty</span> "
                },
                "Type": "If"
              },
              "Type": "BooleanExpression"
            },
            "Message": {
              "messageID": "MS_72vjlCzCFipqnf7",
              "subMessageID": "VE_FORCE_OTHER_RESPONSE",
              "libraryID": "UR_0PzaI4bcyDkTDc9",
              "description": "Require text box entry"
            }
          }
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "AllowFreeResponse": "false"
      },
      "DataExportTag": "Q9"
    },
    "QID42": {
      "QuestionID": "QID42",
      "QuestionText": "Please rate how frequently others identify you as a non-native speaker based on your accent in&nbsp;${lm://Field/1}:",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "0 - never"
        },
        "2": {
          "Display": "1 - almost never"
        },
        "3": {
          "Display": "2"
        },
        "4": {
          "Display": "3"
        },
        "5": {
          "Display": "4"
        },
        "6": {
          "Display": "5 - half the time"
        },
        "7": {
          "Display": "6"
        },
        "8": {
          "Display": "7"
        },
        "9": {
          "Display": "8"
        },
        "10": {
          "Display": "9"
        },
        "11": {
          "Display": "10 - always"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q42"
    },
    "QID40": {
      "QuestionID": "QID40",
      "QuestionText": "Please rate to what extent you are currently exposed to&nbsp;${lm://Field/1} in the following contexts:",
      "QuestionType": "Slider",
      "Selector": "HSLIDER",
      "Choices": {
        "1": {
          "Display": "Interacting with friends"
        },
        "2": {
          "Display": "Interacting with family"
        },
        "3": {
          "Display": "Reading"
        },
        "4": {
          "Display": "Language apps or websites/self instruction"
        },
        "5": {
          "Display": "Watching TV"
        },
        "6": {
          "Display": "Listening to radio/music"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "OFF",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText",
        "CSSliderMin": 0,
        "CSSliderMax": 10,
        "GridLines": 10,
        "SnapToGrid": false,
        "NumDecimals": "0",
        "ShowValue": false,
        "CustomStart": true,
        "SliderStartPositions": {
          "1": 0.4976635514018692,
          "2": 0.4976635514018692,
          "3": 0.4953271028037383,
          "4": 0.4953271028037383,
          "5": 0.4953271028037383,
          "6": 0.4953271028037383
        },
        "NotApplicable": false,
        "MobileFirst": true
      },
      "Labels": {
        "1": {
          "Display": "<div style=\"text-align: left;\">never</div>"
        },
        "2": {
          "Display": "<div style=\"text-align: center;\">half of the time</div>"
        },
        "3": {
          "Display": "<div style=\"text-align: right;\">always</div>"
        }
      },
      "DataExportTag": "Q40"
    },
    "QID21": {
      "QuestionID": "QID21",
      "QuestionText": "The following questions refer to your knowledge of&nbsp;${lm://Field/1}.",
      "QuestionType": "DB",
      "Selector": "TB",
      "ChoiceOrder": [],
      "Validation": {
        "Settings": {
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q21"
    },
    "QID3": {
      "QuestionID": "QID3",
      "QuestionText": "What is your gender?",
      "QuestionType": "MC",
      "Selector": "SAVR",
      "Choices": {
        "1": {
          "Display": "Male"
        },
        "2": {
          "Display": "Female"
        },
        "3": {
          "Display": "Other",
          "TextEntry": "true"
        }
      },
      "ChoiceOrder": [
        1,
        2,
        3
      ],
      "Validation": {
        "Settings": {
          "ForceResponse": "ON",
          "ForceResponseType": "ON",
          "Type": "None"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "DataExportTag": "Q3"
    },
    "QID8": {
      "QuestionID": "QID8",
      "QuestionText": "When choosing a language to speak with a person who is equally fluent in all your languages, what percentage of time would you choose to speak each language? Please report percent of total time.",
      "QuestionType": "CS",
      "Selector": "VRTL",
      "Choices": {
        "1": {
          "Display": "${q://QID4/ChoiceTextEntryValue/1}"
        },
        "2": {
          "Display": "${q://QID4/ChoiceTextEntryValue/2}"
        },
        "3": {
          "Display": "${q://QID4/ChoiceTextEntryValue/3}"
        },
        "4": {
          "Display": "${q://QID4/ChoiceTextEntryValue/4}"
        },
        "5": {
          "Display": "${q://QID4/ChoiceTextEntryValue/5}"
        }
      },
      "ChoiceOrder": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "EnforceRange": "OFF",
          "Type": "ChoicesTotal",
          "ChoiceTotal": "100"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "Labels": [],
      "ClarifyingSymbol": "%",
      "DataExportTag": "Q8"
    },
    "QID7": {
      "QuestionID": "QID7",
      "QuestionText": "When choosing to read a text available in all your languages, in what percentage of cases would you choose to read it in each of your languages? Assume that the original was written in another language, which is unknown to you.",
      "QuestionType": "CS",
      "Selector": "VRTL",
      "Choices": {
        "1": {
          "Display": "${q://QID4/ChoiceTextEntryValue/1}"
        },
        "2": {
          "Display": "${q://QID4/ChoiceTextEntryValue/2}"
        },
        "3": {
          "Display": "${q://QID4/ChoiceTextEntryValue/3}"
        },
        "4": {
          "Display": "${q://QID4/ChoiceTextEntryValue/4}"
        },
        "5": {
          "Display": "${q://QID4/ChoiceTextEntryValue/5}"
        }
      },
      "ChoiceOrder": [
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "Validation": {
        "Settings": {
          "EnforceRange": "OFF",
          "Type": "ChoicesTotal",
          "ChoiceTotal": "100"
        }
      },
      "Configuration": {
        "QuestionDescriptionOption": "UseText"
      },
      "Labels": [],
      "ClarifyingSymbol": "%",
      "DataExportTag": "Q7"
    }
  }
};
