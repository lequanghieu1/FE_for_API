<template>
  <div class="table">
    <div class="head">
      <b-button
        variant="success"
        v-b-modal.modal-prevent-closing
        class="button"
      >
        Add
      </b-button>
      <h1>
        Event-Code Management
      </h1>
    </div>
    <b-container fluid>
      <b-table :items="items" :fields="fields" stacked="md" show-empty small>
        <template #cell(user_name)="row">
          {{ jsUcfirst(row.value) }}
        </template>
        <template #cell(actions)="row">
          <b-button
            variant="outline-warning"
            size="sm"
            class="mr-1"
            @click="handleUpdate(row.item._id,row.item.code,row.item.name)"
          >
            Update
          </b-button>
          <b-button
            size="sm"
            @click="handleDelete(row.item._id)"
            variant="outline-danger"
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </b-container>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Create Event Code"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Code"
          label-for="name-input"
          invalid-feedback="Code is required"
          :state="nameState"
        >
          <b-form-input
          type="number"
            id="name-input"
            v-model="code"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input2"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="modal-edit-prevent-closing"
      ref="modal-update"
      title="Update Event Code"
      @ok="Update"
    >
      <form ref="form">
        <b-form-group label="Code" label-for="name-input6">
          <b-form-input id="name-input6" type="number" v-model="code" :placeholder="this.code_update.toString()"></b-form-input>
        </b-form-group>
      </form>
      <form ref="form">
        <b-form-group label="Name" label-for="name-input">
          <b-form-input
            id="name-input5"
            v-model="name"   
            :placeholder="this.name_update"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>
<script>

import axios from "axios";
import {token} from '../common/helper'
export default {
  data() {
    return {
      code: "",
      name: "",
      nameState: null,
      items: [],
      id_update: "",
      name_update: "",
      code_update: "",
      fields: [

        {
          key: "code",
          label: "Code"
        },
        {
          key: "name",
          label: "Name"
        },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  created() {
    axios
      .get("http://localhost:4040/event-code")
      .then(res => (this.items = res.data))
      .catch(e => this.errors.push(e));
  },

  methods: {
    Update() {
      axios
        .put(`http://localhost:4040/event-code/${this.id_update}`, {
          code: this.code,
          name: this.name,
        })
        .then(console.log("success"))
        .catch(e => {
          console.log(e);
        });
        location.reload()
    },
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.code = "";
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handleUpdate(id,code,name) {
      this.$refs["modal-update"].show();
      this.id_update = id;
      this.name_update = name;
      this.code_update = code
    },
    handleSubmit(bvModalEvt) {
      if (!this.checkFormValidity()) {
        bvModalEvt.preventDefault();
        return;
      }
      axios
        .post("http://localhost:4040/event-code", {
          code: this.code,
          name: this.name,
        },token)
        .then(res => {})
        .catch(e => {
          console.log(e);
        });
    },
    handleDelete(data) {
      let result = confirm("Are you sure ?");
      if (result) {
        axios.delete(`http://localhost:4040/event-code/${data}`,token);
      }
    }
  }
};
</script>
<style>
.table {
  margin-top: 40px;
  margin-left: 142px;
  width: 980px;
}
.button {
  margin-left: 180px;
  margin-top: 20px;
}
.head {
  display: flex;
}
.head h1 {
  margin-left: 200px;
}
</style>
