const createElements = (arr)=>{
    const htmlElements = arr.map((el)=>`<span class="btn">${el}</span>`);

    return htmlElements.join(" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status)=>{
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
else{
    document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
        
    }
}
//Load Lesson
const loadLesson = ()=>
{
    const levelUrl = "https://openapi.programming-hero.com/api/levels/all";
    fetch(levelUrl)
    .then((res)=>res.json())
    .then((json)=>displayLesson(json.data))
};

const removeActive = ()=>{
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach((btn)=>btn.classList.remove("active"))
}
const loadLevelWord=(id)=>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        removeActive(); //remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add("active")//add active class
        displayLevelWords(data.data)
    })
}

const loadWordDetail=async(id)=>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
};
const displayWordDetails = (word)=>{
const detailsBox = document.getElementById("details-container");
console.log(word);
detailsBox.innerHTML = ` <div class="">
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
      </div>
      <div class="">
        <h2 class="text-2xl font-semibold">Meaning</h2>
        <p class="font-bangla font-medium">${word.meaning}</p>
      </div>
      <div class="">
        <h2 class="text-2xl font-semibold">Example</h2>
        <p class="">${word.sentence}</p>
      </div>
      <div class="">
        <h2 class="text-2xl font-bangla font-semibold">সমার্থক শব্দ গুলো</h2>
        <div class="">${createElements(word.synonyms)}</div>
      </div>`;
document.getElementById("word_modal").showModal();

};
const displayLevelWords=(words)=>
{
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = "";

    if(words.length == 0){
        wordContainer.innerHTML = ` <div class="space-x-4 text-center col-span-full space-y-6 font-bangla">
        <img class = "mx-auto" src="./assets/image 1.png"/>
       <p class="text-[13.38px] text-[#79716b] text-center ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
       <h2 class="font-medium text-2xl text-[#292524] ">নেক্সট Lesson এ যান</h2>
      </div> `;
      manageSpinner(false);
        return;
    }
    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `<div class="bg-white rounded-xl shadow-sm text-center py-10 px-5  space-y-4">
  <h2 class="font-bold text-2xl ">${word.word ? word.word : "শব্ধ পাওয়া যায় নি"}</h2>
  <p class="font-medium text-xl ">Meaning /Pronunciation</p>
  <div class="font-semibold font-bangla text-2xl ">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি" } / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায় নি"}"</div>
  <div class="flex justify-between items-center ">
    <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff10] hover:bg-[#5a37f590]"><i class="fa-solid fa-circle-info"></i></button>
    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1a91ff10]  hover:bg-[#5a37f590]"><i class="fa-solid fa-volume-high"></i></button>
  </div>
</div>`;

wordContainer.append(card)
    });
    manageSpinner(false);
}

const displayLesson = (lessons)=>
{
//   1.get the container & empty
const levelContainer = document.getElementById("level-container")
levelContainer.innerHTML="";
// 2. get into every lessons
for(let lesson of lessons)
{
    // 3. create Element
const btnDiv = document.createElement("div");
btnDiv.innerHTML = `
<button id="lesson-btn-${lesson.level_no}" onclick ="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"> <img src="./assets/fa-book-open.png"/>Lesson - ${lesson.level_no}</button>`;
// 4.append into container 
levelContainer.append(btnDiv);
}
}
loadLesson()

document.getElementById("btn-search").addEventListener("click",()=>{
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res)=>res.json())
    .then((data)=>{
      const allWords = data.data;
      console.log(allWords);

      const filterWords = allWords.filter((word)=>word.word.toLowerCase().includes(searchValue));
      displayLevelWords(filterWords)
    })

})
