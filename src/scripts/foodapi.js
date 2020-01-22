// fetch("http://localhost:8088/food")
//     .then(foods => foods.json())
//     .then(parsedFoods => {
//         console.table(parsedFoods)
//     })

const foodFactory = (item) => {
    console.log(item.name);
    return `
        <div class="foodItem">
            <p class="foodName">${item.name}</p>
            <div class="foodDetails">
                ${item.ethnicity} ${item.category}
                <p>${item.ingredients}</p>
                <p>COUNTRY: ${item.countries}</p>
                <p>CALORIES: ${item.calories}</p>
                <p>FAT: ${item.fat}</p>
                <p>SUGAR: ${item.sugar}</p>
            </div>
        </div>
        `
}

const addFoodToDom = (element) => {
    document.getElementById("foodList").innerHTML += element;
}

fetch("http://localhost:8088/food")
    .then(foods => foods.json())
    .then(parsedFoods => {
        parsedFoods.forEach(food => {
            fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    console.log(productInfo);
                    if (productInfo.product.ingredients_text) {
                        food.ingredients = productInfo.product.ingredients_text
                    } else {
                        food.ingredients = "no ingredients listed"
                    }
                    if (productInfo.product.countries) {
                        food.countries = productInfo.product.countries
                    } else {
                        food.countries = "No Country of Origin specified"
                    }
                    if (productInfo.product.nutriments["energy-kcal"]) {
                        food.calories = productInfo.product.nutriments["energy-kcal"]
                    } else {
                        food.calories = "No Calories per serving specified"
                    }
                    if (productInfo.product.nutriments.fat_100g) {
                        food.fat = productInfo.product.nutriments.fat_100g
                    } else {
                        food.fat = "No Fat per serving specified"
                    }
                    if (productInfo.product.nutriments.sugars_100g) {
                        food.sugar = productInfo.product.nutriments.sugars_100g
                    } else {
                        food.sugar = "No Sugar per serving specified"
                    }
                    const foodAsHTML = foodFactory(food)
                    addFoodToDom(foodAsHTML)
                })
        })
    })