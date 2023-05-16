
/*
https://jsfiddle.net/vmr9q4o0/
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
*/

const Utils = {
    fileTypes: [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ],

    validFileType(file) {  
        
        return this.fileTypes.includes(file.type);
    }
};

const Output = {
    generateOutput(){  
        const output = document.createElement("div");
        let codeOutput = '<p class="atribute-color">filter:</p>'

        Filters.imageFiltersList.forEach(function(filter, index){

            codeOutput += 
            '<p class="text-color">&nbsp' + filter.filterName + '</p>' +
            '<p class="parentheses-color">(</p>' + 
            '<p class="number-color">' + filter.value + '</p>' +
            '<p class="parentheses-color">)</p>';
            
        })
        codeOutput += '<p class="text-color">;</p>';

        output.innerHTML = codeOutput;
        output.classList.add("code");
        return output;

        //filter: blur(34%) sepia(23%) drop-shadow(10px 20px 30px #343434);
    },

    updateOutputDisplay(){
        const output = document.querySelector(".output-code");
        output.innerHTML = '';
        output.appendChild(this.generateOutput());
    }
};

const DOM = {
    newFilterButton: document.getElementById("new-filter"),

    createFilter(filter, index){
        const filterElement = document.createElement('div');

        filterElement.classList.add('filter');
        filterElement.innerHTML = this.innerFilter();
        filterElement.dataset.index = index;

        filterElement.querySelector('select').value = filter.filterName;
        filterElement.querySelector('input').value = filter.value;

        document.querySelector('.filters').appendChild(filterElement);
        this.updateInputPlaceholder(index);
    },

    clearFilters(){
        document.querySelector('.filters').innerHTML = '';
    },

    innerFilter(){
        const filter = `
        <select name="select-filter" class="filter-type">
            <option value="blur">Blur</option>
            <option value="brightness">Brightness</option>
            <option value="contrast">Contrast</option>
            <option value="drop-shadow">Drop Shadow</option>
            <option value="grayscale">Grayscale</option>
            <option value="hue-rotate">Hue Rotation</option>
            <option value="invert">Invert</option>
            <option value="opacity">Opacity</option>
            <option value="saturate">Saturate</option>
            <option value="sepia">Sepia</option>
        </select>
        <input type="text" class="filter-input" placeholder="11px">
        <button class="delete-button" id="delete-button">X</button>`;
        
        return filter;
    },

    updateImageDisplay() {
        const input = document.getElementById('input-target-image');
        const preview = document.querySelector('.preview');
        const curFiles = input.files;
    
        while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
      
        if (curFiles.length === 0 || !Utils.validFileType(curFiles[0])) {
            const defaultImage = document.createElement('img');
            defaultImage.src = "assets/images/coala.jpg";
            defaultImage.alt = "Coala Image";
            defaultImage.classList.add("target-image");
            preview.appendChild(defaultImage);
            console.log("no files");
        } else {
            const newImage = document.createElement('img');
            newImage.alt = "Your Image";
            newImage.classList.add("target-image");
            newImage.src = URL.createObjectURL(curFiles[0]);
            preview.appendChild(newImage);
            console.log("success");
            
        }

        this.updateFiltersOnImage();
    },

    updateFiltersOnImage(){
        let filtersString = "";
        Filters.imageFiltersList.forEach(filter => {
            filtersString += filter.filterName + "(" + filter.value + ") ";
        });

        document.querySelector(".target-image").style.filter = filtersString;
    },

    updateInputPlaceholder(index){
        let placeholderText = '';
        const selectedValue = document.querySelector('.filter[data-index="' + index + '"] .filter-type').value;

        switch(selectedValue){
            case 'blur': placeholderText = '5px'; break;
            case 'brightness': placeholderText = '0.35 or 35%'; break;
            case 'contrast': placeholderText = '0.5 or 50%'; break;
            case 'drop-shadow': placeholderText = '10px 30px 20px #2D2D2D'; break;
            case 'grayscale': placeholderText = '0.8 or 80%'; break;
            case 'hue-rotate': placeholderText = '90deg'; break;
            case 'invert': placeholderText = '0.9 or 90%'; break;
            case 'opacity': placeholderText = '0.5 or 50%'; break;
            case 'saturate': placeholderText = '0.3 or 30%'; break;
            case 'sepia': placeholderText = '0.7 or 70%'; break;
        }
        document.querySelector('.filter[data-index="' + index + '"] .filter-input').placeholder = placeholderText;
    }
};

const Filters = {
    imageFiltersList: [],

    addNewFilter(filter){
        this.imageFiltersList.push(filter);
        App.reload();
    },

    removeFilter(index){
        this.imageFiltersList.splice(index, 1);
        App.reload();
    },

    updateFiltersListName(value, index){
        this.imageFiltersList[index].filterName = value;
        App.reload();        
    },

    updateFiltersListValue(value, index){
        this.imageFiltersList[index].value = value;
        App.reload();
    }
};

const EventListeners = {
    subscribeEventListeners(){
        document.getElementById("input-target-image").addEventListener('change', function(){
            DOM.updateImageDisplay();
        });

        document.getElementById("new-filter").addEventListener('click', function(){
            const imageFilterTemplate = {filterName: 'blur', value: ''};
            Filters.addNewFilter(imageFilterTemplate);
        });
    },

    subscribeDynamicEventListeners(){
        const elementFiltersList = document.querySelectorAll(".filter");
        elementFiltersList.forEach(elementFilter => {

            const index = elementFilter.dataset.index;

            elementFilter.querySelector("select").addEventListener('change', function(event){
                Filters.updateFiltersListName(event.target.value, index);
                Filters.updateFiltersListValue('', index);
                DOM.updateInputPlaceholder(index);
                DOM.updateFiltersOnImage();
            });

            elementFilter.querySelector("input").addEventListener('change', function(event){
                Filters.updateFiltersListValue(event.target.value, index);
                DOM.updateFiltersOnImage();
            });

            elementFilter.querySelector(".delete-button").addEventListener('click', function(){
                Filters.removeFilter(index);
            });
        }); 
    },
};

const App = {
    init(){
        if(Filters.imageFiltersList.length > 0){
            Filters.imageFiltersList.forEach(function(filter, index){
                DOM.createFilter(filter, index);
            })
        }
        Output.updateOutputDisplay();
        EventListeners.subscribeDynamicEventListeners();
    },

    reload(){
        DOM.clearFilters();
        this.init();
        DOM.updateFiltersOnImage();
    },
}

App.init();
EventListeners.subscribeEventListeners();