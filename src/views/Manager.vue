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
        Users Management
      </h1>
    </div>
    <b-container fluid>
      <b-table :items="managers" :fields="fields" stacked="md" show-empty small>
        <template #cell(user_name)="row">
          {{ jsUcfirst(row.value) }}
        </template>
        <template #cell(actions)="row">
          <b-button
            variant="outline-warning"
            size="sm"
            class="mr-1"
            @click="
              handleUpdate(row.item._id, row.item.full_name, row.item.password)
            "
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
      title="Create User"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="User Name"
          label-for="name-input"
          invalid-feedback="User name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="user_name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Full name"
          label-for="name-input"
          invalid-feedback="Full name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input2"
            v-model="full_name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Password"
          label-for="name-input"
          invalid-feedback="Password is required"
          :state="nameState"
        >
          <b-form-input
            type="password"
            id="name-input3"
            v-model="password"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="modal-edit-prevent-closing"
      ref="modal-update"
      title="Update User"
      @ok="Update"
    >
      <form ref="form">
        <b-form-group label="Is_login" label-for="name-input4">
          <b-form-select v-model="selected" :options="options"></b-form-select>
        </b-form-group>
      </form>
      <form ref="form">
        <b-form-group label="Full name" label-for="name-input6">
          <b-form-input
            id="name-input6"
            v-model="full_name"
            :placeholder="this.name_update"
          ></b-form-input>
        </b-form-group>
      </form>
      <form ref="form">
        <b-form-group label="Password" label-for="name-input">
          <b-form-input
            id="name-input5"
            type="password"
            v-model="password"
            :placeholder="this.pass_update"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import { token } from "../common/helper";
import { mapState } from "vuex";
export default {
  data() {
    return {
      selected: false,
      user_name: "vfdfv",
      full_name: "",
      password: "",
      is_login: "",
      nameState: null,
      items: this.$store.state.items,
      options: [
        { value: true, text: "true" },
        { value: false, text: "false" }
      ],
      id_update: "",
      name_update: "",
      pass_update: "",
      fields: [
        {
          key: "user_name",
          label: "User_name"
        },
        {
          key: "full_name",
          label: "Full_name"
        },
        {
          key: "is_login",
          label: "Is Login"
        },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("loadManagers");
  },
  computed: mapState(["managers"]),
  methods: {
    Update() {
      console.log();
      this.$store.dispatch("updateManagers", {
        id: this.id_update,
        data: {
          full_name: this.full_name,
          password: this.password,
          is_login: this.selected
        }
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
      this.full_name = "";
      this.user_name = "";
      this.password = "";
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handleUpdate(id, name, pass) {
      this.$refs["modal-update"].show();
      this.id_update = id;
      this.name_update = name;
      this.pass_update = pass;
    },
    handleSubmit(bvModalEvt) {
      if (!this.checkFormValidity()) {
        bvModalEvt.preventDefault();
        return;
      }
      this.$store.dispatch("addManagers", {
        user_name: this.user_name,
        full_name: this.full_name,
        password: this.password,
        is_login: false
      });
    },
    handleDelete(data) {
      let result = confirm("Are you sure ?");
      if (result) {
        this.$store.dispatch("delManagers", data);
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
