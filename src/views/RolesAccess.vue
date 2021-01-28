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
        Roles-Access Management
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
            @click="handleUpdate(row.item._id, row.item.id_extra, row.item.name_model)"
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
          label="ID user"
          label-for="name-input"
          invalid-feedback="ID user is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="id_extra"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name Model"
          label-for="name-input"
          invalid-feedback="Name Model is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input2"
            v-model="name_model"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <b-form-group label="Read" label-for="name-input6">
        <b-form-select v-model="read" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Add" label-for="name-input6">
        <b-form-select v-model="add" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Update" label-for="name-input6">
        <b-form-select v-model="update" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Delete" label-for="name-input6">
        <b-form-select v-model="del" :options="options"></b-form-select>
      </b-form-group>
    </b-modal>
    <b-modal
      id="modal-edit-prevent-closing"
      ref="modal-update"
      title="Update Roles Access"
      @ok="Update"
    >
      <form ref="form">
        <b-form-group label="ID User" label-for="name-input6">
          <b-form-input
            id="name-input6"
            v-model="id_extra"
            :placeholder="this.id_extra_update.toString()"
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form">
        <b-form-group label="Name Model" label-for="name-input">
          <b-form-input
            id="name-input5"
            v-model="name_model"
            :placeholder="this.name_model_update.toString()"
          ></b-form-input>
        </b-form-group>
      </form>
      <b-form-group label="Read" label-for="name-input3">
        <b-form-select v-model="read" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Add" label-for="name-input4">
        <b-form-select v-model="add" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Update" label-for="name-input3">
        <b-form-select v-model="update" :options="options"></b-form-select>
      </b-form-group>
      <b-form-group label="Delete" label-for="name-input4">
        <b-form-select v-model="del" :options="options"></b-form-select>
      </b-form-group>
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import {token} from '../common/helper'
export default {
  data() {
    return {
      name_model: "",
      id_extra: "",
      add: null,
      read: null,
      del: null,
      update: null,
      nameState: null,
      items: [],
      id_update: "",
      name_model_update: "",
      id_extra_update: "",
      options: [
        { value: true, text: "true" },
        { value: false, text: "false" }
      ],
      fields: [
        {
          key: "id_extra",
          label: "ID User"
        },
        {
          key: "name_model",
          label: "Name Model"
        },
        {
          key: "read",
          label: "Read"
        },
        {
          key: "add",
          label: "Add"
        },

        {
          key: "update",
          label: "Update"
        },
        {
          key: "delete",
          label: "Delete"
        },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  created() {
    axios
      .get("http://localhost:4040/roles-access")
      .then(res => (this.items = res.data))
      .catch(e => this.errors.push(e));
  },

  methods: {
    Update() {
      axios
        .put(`http://localhost:4040/roles-access/${this.id_update}`, {
          id_extra: this.id_extra,
          name_model: this.name_model,
          add: this.add,
          read: this.read,
          update: this.update,
          del: this.del
        })
        .then(console.log("success"))
        .catch(e => {
          console.log(e);
        });
      
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
    handleUpdate(id, id_extra, name_model) {
      this.$refs["modal-update"].show();
      this.id_update = id;
      this.id_extra_update = id_extra;
      this.name_model_update = name_model;
    },
    handleSubmit(bvModalEvt) {
      if (!this.checkFormValidity()) {
        bvModalEvt.preventDefault();
        return;
      }
      axios
        .post("http://localhost:4040/roles-access", {
          id_extra: this.id_extra,
          name_model: this.name_model,
          add: this.add,
          read: this.read,
          update: this.update,
          del: this.del
        },token)
        .then(res => {})
        .catch(e => {
          console.log(e);
        });
    },
    handleDelete(data) {
      let result = confirm("Are you sure ?");
      if (result) {
        axios.delete(`http://localhost:4040/roles-access/${data}`,token);
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
