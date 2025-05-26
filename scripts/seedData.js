import dotenv from "dotenv"
import User from "../models/User.js"
import Meal from "../models/Meal.js"
import Workout from "../models/Workout.js"
import Reminder from "../models/Reminder.js"
import connectDB from "../config/database.js"

dotenv.config()

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Meal.deleteMany({})
    await Workout.deleteMany({})
    await Reminder.deleteMany({})

    console.log("🗑️  Cleared existing data")

    // Create sample users
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        age: 28,
        weight: 75,
        height: 180,
        gender: "male",
        preferences: {
          dietType: "balanced",
          fitnessLevel: "intermediate",
          goals: ["weight-loss", "muscle-gain"],
        },
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        age: 25,
        weight: 60,
        height: 165,
        gender: "female",
        preferences: {
          dietType: "vegetarian",
          fitnessLevel: "beginner",
          goals: ["endurance", "strength"],
        },
      },
    ])

    console.log("👥 Created sample users")

    // Create sample meals
    const meals = await Meal.create([
      {
        title: "Protein Power Bowl",
        description: "A nutritious bowl packed with protein and vegetables",
        category: "lunch",
        cuisine: "american",
        ingredients: [
          { name: "Quinoa", quantity: 100, unit: "g" },
          { name: "Chicken breast", quantity: 150, unit: "g" },
          { name: "Broccoli", quantity: 100, unit: "g" },
          { name: "Avocado", quantity: 50, unit: "g" },
        ],
        instructions: [
          { step: 1, description: "Cook quinoa according to package instructions" },
          { step: 2, description: "Grill chicken breast until cooked through" },
          { step: 3, description: "Steam broccoli until tender" },
          { step: 4, description: "Assemble bowl and top with sliced avocado" },
        ],
        nutrition: {
          calories: 450,
          protein: 35,
          carbs: 40,
          fats: 15,
          fiber: 8,
          sugar: 5,
          sodium: 300,
        },
        prepTime: 15,
        cookTime: 20,
        servings: 1,
        difficulty: "easy",
        tags: ["high-protein", "healthy", "gluten-free"],
        createdBy: users[0]._id,
      },
      {
        title: "Overnight Oats",
        description: "Easy make-ahead breakfast with oats and berries",
        category: "breakfast",
        cuisine: "american",
        ingredients: [
          { name: "Rolled oats", quantity: 50, unit: "g" },
          { name: "Milk", quantity: 200, unit: "ml" },
          { name: "Mixed berries", quantity: 100, unit: "g" },
          { name: "Honey", quantity: 1, unit: "tbsp" },
        ],
        instructions: [
          { step: 1, description: "Mix oats and milk in a jar" },
          { step: 2, description: "Add honey and stir well" },
          { step: 3, description: "Top with berries" },
          { step: 4, description: "Refrigerate overnight" },
        ],
        nutrition: {
          calories: 320,
          protein: 12,
          carbs: 55,
          fats: 8,
          fiber: 10,
          sugar: 25,
          sodium: 100,
        },
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        difficulty: "easy",
        tags: ["vegetarian", "quick", "healthy"],
        createdBy: users[1]._id,
      },
    ])

    console.log("🍽️  Created sample meals")

    // Create sample workouts
    const workouts = await Workout.create([
      {
        title: "Full Body HIIT",
        description: "High-intensity interval training for full body conditioning",
        category: "hiit",
        difficulty: "intermediate",
        duration: 30,
        exercises: [
          {
            name: "Burpees",
            type: "cardio",
            muscleGroups: ["full-body"],
            equipment: ["none"],
            instructions: [
              { step: 1, description: "Start in standing position" },
              { step: 2, description: "Drop into squat and place hands on floor" },
              { step: 3, description: "Jump feet back into plank" },
              { step: 4, description: "Do a push-up" },
              { step: 5, description: "Jump feet back to squat" },
              { step: 6, description: "Jump up with arms overhead" },
            ],
            duration: 45,
            sets: 3,
            reps: 10,
            restTime: 15,
            caloriesBurned: 12,
          },
          {
            name: "Mountain Climbers",
            type: "cardio",
            muscleGroups: ["core", "shoulders"],
            equipment: ["none"],
            instructions: [
              { step: 1, description: "Start in plank position" },
              { step: 2, description: "Bring right knee to chest" },
              { step: 3, description: "Switch legs quickly" },
              { step: 4, description: "Continue alternating" },
            ],
            duration: 30,
            sets: 3,
            reps: 20,
            restTime: 15,
            caloriesBurned: 8,
          },
        ],
        equipment: ["none"],
        location: ["home", "gym"],
        targetMuscles: ["full-body", "core"],
        caloriesBurned: 250,
        tags: ["fat-loss", "high-intensity", "no-equipment"],
        createdBy: users[0]._id,
      },
      {
        title: "Beginner Yoga Flow",
        description: "Gentle yoga sequence perfect for beginners",
        category: "yoga",
        difficulty: "beginner",
        duration: 20,
        exercises: [
          {
            name: "Child's Pose",
            type: "flexibility",
            muscleGroups: ["back"],
            equipment: ["none"],
            instructions: [
              { step: 1, description: "Kneel on the floor" },
              { step: 2, description: "Sit back on your heels" },
              { step: 3, description: "Fold forward with arms extended" },
              { step: 4, description: "Hold and breathe deeply" },
            ],
            duration: 60,
            sets: 1,
            reps: 1,
            restTime: 0,
            caloriesBurned: 2,
          },
        ],
        equipment: ["none"],
        location: ["home"],
        targetMuscles: ["back", "shoulders"],
        caloriesBurned: 80,
        tags: ["flexibility", "beginner-friendly", "no-equipment"],
        createdBy: users[1]._id,
      },
    ])

    console.log("💪 Created sample workouts")

    // Create sample reminders
    const reminders = await Reminder.create([
      {
        user: users[0]._id,
        type: "water",
        title: "Drink Water",
        description: "Stay hydrated throughout the day",
        time: "09:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        frequency: "daily",
      },
      {
        user: users[0]._id,
        type: "workout",
        title: "Morning Workout",
        description: "Start your day with exercise",
        time: "07:00",
        days: ["monday", "wednesday", "friday"],
        frequency: "custom",
      },
      {
        user: users[1]._id,
        type: "meals",
        title: "Healthy Lunch",
        description: "Time for a nutritious meal",
        time: "12:30",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        frequency: "daily",
      },
    ])

    console.log("⏰ Created sample reminders")

    console.log("✅ Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
