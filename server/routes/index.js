import express from 'express'

var router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Elias Akande',
      github: '@TheHelias',
      email: 'akandetoluwalase@gmail.com',
      mobile: '08166746401',
      twitter: '@_ThElias'
    }
  })
})

router.post('/validate-rule', async (req, res, next) => {
  let fieldValue
  const payload = req.body
  const ruleKeys = ['field', 'condition', 'condition_value']
  const validConditions = ['eq', 'neq', 'gt', 'gte', 'contains']
  const genericErrorResponse = (message) =>
    res.status(400).send({
      message: message,
      status: 'error',
      data: null
    })

  try {
    // check for rule field
    if (!payload.rule) {
      genericErrorResponse('rule is required.')
      return
    }

    // check for data field
    if (!payload.data) {
      genericErrorResponse('data is required.')
      return
    }

    // validate rule field type
    if (typeof payload.rule !== 'object') {
      genericErrorResponse('rule should be an object.')
      return
    }

    // validate data field type
    if (
      (typeof payload.data === 'object' && payload.data !== null) ||
      typeof payload.data === 'string'
    ) {
    } else {
      genericErrorResponse('data should be an object, array or string.')
      return
    }

    // check for all expected rule keys
    for (let i = 0; i < ruleKeys.length; i++) {
      if (!payload.rule.hasOwnProperty(ruleKeys[i])) {
        genericErrorResponse(`${ruleKeys[i]} is required.`)
        return
      }
    }

    // check nested rule field, validate it and set field value
    if (payload.rule.field.includes('.')) {
      const nestings = payload.rule.field.split('.')
      if (nestings.length > 2) {
        genericErrorResponse('rule field is invalid.')
        return
      } else if (!payload.data[nestings[0]][nestings[1]]) {
        genericErrorResponse(`field ${nestings[0]} is missing from data.`)
        return
      }
      fieldValue = await payload.data[nestings[0]][nestings[1]]
    } else if (!payload.data[payload.rule.field]) {
      genericErrorResponse(`field ${payload.rule.field} is missing from data.`)
      return
    } else {
      fieldValue = await payload.data[payload.rule.field]
    }
    console.log(2)
    if (!validConditions.includes(payload.rule.condition)) {
      genericErrorResponse("condition isn't valid.")
    }

    const ruleValidationResponse = (error, condition) => {
      const data = {
        validation: {
          error: error,
          field: payload.rule.field,
          field_value: fieldValue,
          condition: condition,
          condition_value: payload.rule.condition_value
        }
      }
      if (error) {
        res.status(400).send({
          message: `field ${payload.rule.field} failed validation.`,
          status: 'error',
          data: data
        })
      } else {
        res.status(200).send({
          message: `field ${payload.rule.field} successfully validated.`,
          status: 'success',
          data: data
        })
      }
    }

    // rule validation
    switch (payload.rule.condition) {
      case 'eq':
        if (fieldValue === payload.rule.condition_value) {
          ruleValidationResponse(false, 'eq')
        } else {
          ruleValidationResponse(true, 'eq')
        }
        break
      case 'neq':
        if (fieldValue !== payload.rule.condition_value) {
          ruleValidationResponse(false, 'neq')
        } else {
          ruleValidationResponse(true, 'neq')
        }
        break
      case 'gt':
        if (fieldValue > payload.rule.condition_value) {
          ruleValidationResponse(false, 'gt')
        } else {
          ruleValidationResponse(true, 'gt')
        }
        break
      case 'gte':
        if (fieldValue >= payload.rule.condition_value) {
          ruleValidationResponse(false, 'gte')
        } else {
          ruleValidationResponse(true, 'gte')
        }
        break
      case 'contains':
        if (fieldValue.includes(payload.rule.condition_value)) {
          ruleValidationResponse(false, 'contains')
        } else {
          ruleValidationResponse(true, 'contains')
        }
    }
  } catch {
    genericErrorResponse('Invalid JSON payload passed.')
  }
})

export default router
