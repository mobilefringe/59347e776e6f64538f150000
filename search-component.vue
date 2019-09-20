<template>
	<div>
	    <div class="search-component" v-if="autocomplete">
    		<p class="control has-icon has-icon-right">
    			<label style="display:none;" for="search_box">Search</label>
    			<input id="search_box" type="search" class="input is-large" :placeholder="placeholder" :suggestionAttribute="suggestionAttribute" v-on:input="onInput($event.target.value)"
    				v-on:keyup.esc="isOpen = false" v-on:blur="isOpen = false" v-on:keydown.down="moveDown" v-on:keydown.up="moveUp" v-on:keydown.enter="select"
    				:value="value">
    			<i id="siteSearchBtn" class="fa fa-search" @click="select"></i>
    		</p>
    		<ul v-show="isOpen" class="options-list" v-if="result.length > 0">
    			<li  v-for="(option, index) in result" :class="{'highlighted': index === highlightedPosition}" v-on:mouseenter="highlightedPosition = index" v-on:mousedown="select" :key="index">
    				<slot name="item" :data="option"></slot>
    			</li>
    		</ul>
    		<ul v-else  v-show="isOpen" class="options-list">
    			<li>
    				<p>No Results</p>
    			</li>
    		</ul>
    	</div>
    	<div class="search-component" v-else>
    		<p class="control has-icon has-icon-right">
    			<label style="display:none;" for="search_box">Search</label>
    			<input  id="search_box" type="search" class="input is-large" :placeholder="placeholder" v-on:keydown.enter="select" v-on:input="onInput($event.target.value)"
    				:value="value">
    			<i id="siteSearchBtn" class="fa fa-search"  @click="select"></i>
    		</p>
    	</div>
	</div>
</template>

<style>
  .search-component ul{
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .search-component li {
    display: inline-block;
    margin: 0 10px;
  }

  .search-component{
    width: 100%;
    position: relative;
  }

  ul.options-list {
    display: flex;
    flex-direction: column;
    margin-top: -12px;
    border: 1px solid #dbdbdb;
    border-radius: 0 0 3px 3px;
    position: absolute;
    width: 100%;
    overflow: hidden;
  }

  ul.options-list li {
    width: 100%;
    flex-wrap: wrap;
    background: white;
    margin: 0;
    border-bottom: 1px solid #eee;
    color: #363636;
    padding: 7px;
    cursor: pointer;
  }

  ul.options-list li.highlighted {
    background: #f8f8f8
  }

</style>

<script>
  define(["Vue", "Fuse"], function(Vue, Fuse) {
    return Vue.component('search-component', {
      template: template,
      props: {
        value: {
          type: String,
          default: ""
        },
        autocomplete: {
          type: Boolean,
          default: true
        },
        placeholder: {
          type: String,
          default: "Search..."
        },
        suggestionAttribute: {
          type: String,
          required: true
        },
        eventName: {
          type: String,
          default: "fuseResultsUpdated"
        },
        defaultAll: {
          type: Boolean,
          default: false
        },
        list: {
          type: Array
        },
        caseSensitive: {
          type: Boolean,
          default: false
        },
        includeScore: {
          type: Boolean,
          default: false
        },
        includeMatches: {
          type: Boolean,
          default: false
        },
        tokenize: {
          type: Boolean,
          default: false
        },
        matchAllTokens: {
          type: Boolean,
          default: false
        },
        findAllMatches: {
          type: Boolean,
          default: false
        },
        id: {
          type: String,
          default: ""
        },
        shouldSort: {
          type: Boolean,
          default: true
        },
        threshold: {
          type: Number,
          default: 0
        },
        location: {
          type: Number,
          default: 0
        },
        distance: {
          type: Number,
          default: 100
        },
        maxPatternLength: {
          type: Number,
          default: 32
        },
        minMatchCharLength: {
          type: Number,
          default: 1
        },
        keys: {
          type: Array
        }
      },
      data() {
        return {
          isOpen: false,
          highlightedPosition: 0,
          //search: '',
          fuse: null,
          result: []
        };
      },
      computed: {
        /*
          fOptions() {
            const re = new RegExp(this.search, 'i')
            console.log(this.result);
            return this.result.filter(o => o[this.suggestionAttribute].match(re))
          },
          */
        options() {
          var options = {
            caseSensitive: this.caseSensitive,
            includeScore: this.includeScore,
            includeMatches: this.includeMatches,
            tokenize: this.tokenize,
            matchAllTokens: this.matchAllTokens,
            findAllMatches: this.findAllMatches,
            shouldSort: this.shouldSort,
            threshold: this.threshold,
            location: this.location,
            distance: this.distance,
            maxPatternLength: this.maxPatternLength,
            minMatchCharLength: this.minMatchCharLength,
            keys: this.keys
          };
          if (this.id !== "") {
            options.id = this.id;
          }
          if (this.keys === undefined) {
            options.keys = [];
            options.keys.push(this.suggestionAttribute);
          }
          return options;
        }
      },
      watch: {
        value() {
          if (this.value.trim() === "") {
            if (this.defaultAll) {
              this.result = this.list;
            } else {
              this.result = [];
            }
          } else {
            this.result = this.fuse.search(this.value.trim());
          }
        },
        result() {
          this.$parent.$emit(this.eventName, this.result);
        }
      },
      methods: {
        onInput(value) {
          this.highlightedPosition = 0;
          this.isOpen = !!value;
          this.$emit("input", value); // emit event back to parent
        },
        moveDown() {
          if (!this.isOpen) {
            return;
          }
          this.highlightedPosition =
            (this.highlightedPosition + 1) % this.result.length;
        },
        moveUp() {
          if (!this.isOpen) {
            return;
          }
          this.highlightedPosition =
            this.highlightedPosition - 1 < 0
              ? this.result.length - 1
              : this.highlightedPosition - 1;
        },
        select() {
          if (this.autocomplete) {
            const selectedOption = this.result[this.highlightedPosition];
            this.$emit("select", selectedOption);
            this.isOpen = false;
            this.$emit("input", selectedOption[this.suggestionAttribute]);
          } else {
            const selectedOption = this.result;
            this.$emit("select", selectedOption);
          }
        },
        initFuse() {
          this.fuse = new Fuse(this.list, this.options);
          if (this.defaultAll) {
            this.result = this.list;
          }
        }
      },
      mounted() {
        this.initFuse();
      }
    });
  });
</script>