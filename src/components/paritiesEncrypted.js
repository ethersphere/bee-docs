
let parities = [
    // Medium
    [
      3, 3,  // For chunks 1-2
      4, 4, 4, 4, 4,  // For chunks 3-7
      5, 5, 5, 5, 5, 5, 5,  // For chunks 8-14
      6, 6, 6, 6, 6, 6, 6, 6, 6,  // For chunks 15-23
      7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  // For chunks 24-34
      8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,  // For chunks 35-47
      9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,  // For chunks 48-59
    ],
    // Strong
    
    | Medium   | 3        | 1-2              |
    | Medium   | 4        | 3-7              |
    | Medium   | 5        | 8-14             |
    | Medium   | 6        | 15-23            |
    | Medium   | 7        | 24-34            |
    | Medium   | 8        | 35-47            |
    | Medium   | 9        | 48-59            |
]

export default parities
