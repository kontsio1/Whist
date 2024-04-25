export interface callsGetRequest {
    roundno: number
    player1?: number
    player2?: number 
    player3?: number 
    player4?: number 
    player5?: number 
    player6?: number
}

export interface callsPostRequest {
    roundNo: number
    player1?: number
    player2?: number
    player3?: number
    player4?: number
    player5?: number
    player6?: number
}
export interface user {
    id?: number
    username: string
}
// request body is array of user interfaces
export interface tricksGetRequest {
    roundno: number
    player1?: number
    player2?: number
    player3?: number
    player4?: number
    player5?: number
    player6?: number
}

export interface tricksPostRequest {
    roundNo: number
    player1?: number
    player2?: number
    player3?: number
    player4?: number
    player5?: number
    player6?: number
}
