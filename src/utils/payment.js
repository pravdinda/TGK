export function getIdempotenceKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function createYandexPayment(merchantId, secretKey, idempotenceKey, account, date, amount, sum, fine, stateDuty, transId) {
  const headers = {
    'Authorization': `Basic ${btoa(`${merchantId}:${secretKey}`)}`,
    'Idempotence-Key': idempotenceKey,
    'Content-Type': 'application/json',
  }

  const description = `${account.number}:${date}:${sum}:${fine}:${stateDuty}:${transId}`

  const body = {
    amount: {
      value: amount.toString(),
      currency: "RUB"
    },
    capture: true,
    confirmation: {
      "type": "redirect",
      "return_url": "https://www.merchant-website.com/return_url"
    },
    description,
    metadata: {
      "order_id": transId.toString()
    }
  }

  const opts = {
    method: 'POST',
    headers,
    body
  }

  const res = await fetch('https://payment.yandex.net/api/v3/payments', opts)
}