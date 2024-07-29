# GYMAPP

## ROUTES

### In user/:id always include password in body

{
password: "x"
}

### GET /login

{
email,
password
}

### POST /user

{
user: {
name,
email,
password,
age,
weight,
height,
trainings
}
}

### POST /user/:id/training

{
training: {
duration,
exercises
}
}

### PUT /user/:id

{
user,
password
}

### PUT /user/:id/training/:trainingId

{
training,
password
}

### DELETE /user/:id

{
password
}

### DELETE /user/:id/training/:trainingId

{
password
}
