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
  let field
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

  if (!payload.rule) {
    genericErrorResponse('rule is required.')
    return
  }

  if (!payload.data) {
    genericErrorResponse('data is required.')
    return
  }

  if (typeof payload.rule !== 'object') {
    genericErrorResponse('rule should be an object.')
    return
  }

  if (
    typeof payload.data !== 'object' ||
    Array.isArray(payload.data) === false ||
    typeof payload.data !== 'string' ||
    payload.data === null
  ) {
    genericErrorResponse('rule should be an object, array or string.')
    return
  }

  for (let i = 0; i < ruleKeys.length; i++) {
    if (!payload.rule.hasOwnProperty(ruleKeys[i])) {
      genericErrorResponse(`${ruleKeys[i]} is required.`)
      break
    }
    return
  }

  if (payload.rule.field.includes('.')) {
    const nestings = payload.rule.field.split('.')
    if (nestings.length > 2) {
      genericErrorResponse('Invalid field.')
      return
    } else if (!payload.data[nestings[0]][nestings[1]]) {
      genericErrorResponse(`field ${nestings[0]} is missing from data.`)
      return
    }
    field = await nestings[1]
    fieldValue = await payload.data[nestings[0]][nestings[1]]
  } else {
    field = await payload.rule.field
    fieldValue = await payload.data[payload.rule.field]
  }

  if (!validConditions.includes(payload.rule.condition)) {
    genericErrorResponse("condition isn't valid.")
  }

  const ruleValidationResponse = (error, condition) => {
    const data = {
      validation: {
        error: error,
        field: field,
        field_value: fieldValue,
        condition: condition,
        condition_value: payload.rule.condition_value
      }
    }
    if (error) {
      res.status(400).send({
        message: `field ${field} failed validation.`,
        status: 'error',
        data: data
      })
    } else {
      res.status(200).send({
        message: `field ${field} successfully validated.`,
        status: 'success',
        data: data
      })
    }
  }

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
})
export default router
