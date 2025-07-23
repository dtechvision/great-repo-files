module.exports = {
  "no-try-catch-in-effect-gen": {
    meta: {
      type: "problem",
      docs: {
        description: "disallow try-catch blocks inside Effect.gen generators",
        category: "Best Practices",
        recommended: true,
      },
      schema: [],
      messages: {
        noTryCatch:
          "Never use try-catch blocks inside Effect.gen generators. Use Effect.tryPromise, Effect.try, or proper Effect error handling instead.",
      },
    },
    create(context) {
      function isEffectGen(node) {
        return (
          node.type === "CallExpression"
          && node.callee.type === "MemberExpression"
          && node.callee.object.type === "Identifier"
          && node.callee.object.name === "Effect"
          && node.callee.property.type === "Identifier"
          && node.callee.property.name === "gen"
        )
      }

      function checkTryCatchInGenerator(node) {
        let current = node.parent
        while (current) {
          if (current.type === "CallExpression" && isEffectGen(current)) {
            context.report({
              node,
              messageId: "noTryCatch",
            })
            break
          }
          current = current.parent
        }
      }

      return {
        TryStatement: checkTryCatchInGenerator,
      }
    },
  },

  "no-type-assertions": {
    meta: {
      type: "problem",
      docs: {
        description: "disallow dangerous type assertions",
        category: "Best Practices",
        recommended: true,
      },
      schema: [],
      messages: {
        noTypeAssertion:
          "Never use '{{ assertion }}' type assertions. Fix the underlying type issues instead of masking them.",
      },
    },
    create(context) {
      function checkTypeAssertion(node) {
        const typeAnnotation = node.typeAnnotation
        if (
          typeAnnotation
          && typeAnnotation.type === "TSTypeReference"
          && typeAnnotation.typeName.type === "Identifier"
        ) {
          const typeName = typeAnnotation.typeName.name
          if (
            typeName === "any" || typeName === "never" || typeName === "unknown"
          ) {
            context.report({
              node,
              messageId: "noTypeAssertion",
              data: {
                assertion: `as ${typeName}`,
              },
            })
          }
        }
      }

      return {
        TSTypeAssertion: checkTypeAssertion,
        TSAsExpression: checkTypeAssertion,
      }
    },
  },

  "require-return-yield-for-errors": {
    meta: {
      type: "problem",
      docs: {
        description:
          "require 'return yield*' pattern when yielding errors or interrupts in Effect.gen",
        category: "Best Practices",
        recommended: true,
      },
      schema: [],
      messages: {
        requireReturnYield:
          "Always use 'return yield*' when yielding Effect.fail, Effect.interrupt, or other terminal effects.",
      },
    },
    create(context) {
      function isEffectGen(node) {
        return (
          node.type === "CallExpression"
          && node.callee.type === "MemberExpression"
          && node.callee.object.type === "Identifier"
          && node.callee.object.name === "Effect"
          && node.callee.property.type === "Identifier"
          && node.callee.property.name === "gen"
        )
      }

      function isTerminalEffect(node) {
        if (node.type !== "CallExpression") return false
        if (node.callee.type !== "MemberExpression") return false

        const obj = node.callee.object
        const prop = node.callee.property

        return (
          obj.type === "Identifier"
          && obj.name === "Effect"
          && prop.type === "Identifier"
          && (prop.name === "fail" || prop.name === "interrupt")
        )
      }

      function checkYieldExpression(node) {
        if (!node.delegate) return

        let current = node.parent
        while (current) {
          if (current.type === "CallExpression" && isEffectGen(current)) {
            if (isTerminalEffect(node.argument)) {
              if (node.parent.type !== "ReturnStatement") {
                context.report({
                  node,
                  messageId: "requireReturnYield",
                })
              }
            }
            break
          }
          current = current.parent
        }
      }

      return {
        YieldExpression: checkYieldExpression,
      }
    },
  },

  "no-effect-runsync-in-gen": {
    meta: {
      type: "problem",
      docs: {
        description: "disallow Effect.runSync inside Effect.gen generators",
        category: "Best Practices",
        recommended: true,
      },
      schema: [],
      messages: {
        noRunSync:
          "Never use Effect.runSync inside Effect.gen generators. Use yield* instead.",
      },
    },
    create(context) {
      function isEffectGen(node) {
        return (
          node.type === "CallExpression"
          && node.callee.type === "MemberExpression"
          && node.callee.object.type === "Identifier"
          && node.callee.object.name === "Effect"
          && node.callee.property.type === "Identifier"
          && node.callee.property.name === "gen"
        )
      }

      function isEffectRunSync(node) {
        return (
          node.type === "CallExpression"
          && node.callee.type === "MemberExpression"
          && node.callee.object.type === "Identifier"
          && node.callee.object.name === "Effect"
          && node.callee.property.type === "Identifier"
          && node.callee.property.name === "runSync"
        )
      }

      function checkRunSyncInGenerator(node) {
        if (!isEffectRunSync(node)) return

        let current = node.parent
        while (current) {
          if (current.type === "CallExpression" && isEffectGen(current)) {
            context.report({
              node,
              messageId: "noRunSync",
            })
            break
          }
          current = current.parent
        }
      }

      return {
        CallExpression: checkRunSyncInGenerator,
      }
    },
  },

  "prefer-effect-constructors": {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "prefer Effect library constructors over native JavaScript equivalents",
        category: "Best Practices",
        recommended: false,
      },
      schema: [],
      messages: {
        preferEffectConstructor:
          "Prefer {{ effectMethod }} over {{ nativeMethod }} for consistency with Effect patterns.",
      },
    },
    create(context) {
      const constructorMap = {
        "Array.from": "Array.fromIterable",
        "Array.of": "Array.make",
      }

      function checkCallExpression(node) {
        if (
          node.callee.type === "MemberExpression"
          && node.callee.object.type === "Identifier"
          && node.callee.property.type === "Identifier"
        ) {
          const methodName =
            `${node.callee.object.name}.${node.callee.property.name}`
          const effectAlternative = constructorMap[methodName]

          if (effectAlternative) {
            context.report({
              node,
              messageId: "preferEffectConstructor",
              data: {
                nativeMethod: methodName,
                effectMethod: effectAlternative,
              },
            })
          }
        }
      }

      return {
        CallExpression: checkCallExpression,
      }
    },
  },
}
