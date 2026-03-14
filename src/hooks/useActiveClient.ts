export function getActiveClientId(): string | null {
  return sessionStorage.getItem("client_id")
}

export function setActiveClientId(clientId: string) {
  sessionStorage.setItem("client_id", clientId)
}
