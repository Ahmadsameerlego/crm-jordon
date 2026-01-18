<template>
  <EmployeeLayout>
    <template #title> العملاء </template>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search')"
            class="pl-10 pr-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <i
            class="pi pi-search absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="showAddModal = true" class="btn-primary">
          <i class="pi pi-plus mr-2"></i>
          إضافة عميل جديد
        </button>
      </div>
    </div>
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                اسم الشركة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                اسم المسئول
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                رقم الجوال
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                ملاحظات
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                عروض الأسعار
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr v-for="client in filteredClients" :key="client.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ client.first_name }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.full_name }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.phone_info }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.desc }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                <button
                  @click="showAddOfferModal = true , order=client"
                  class="mr-2 px-3 py-1 rounded-lg text-sm font-medium"
                  :class="[
                    'btn-secondary',
                    client.offer_orders_count === 0
                      ? 'bg-green text-white'
                      : 'bg-red text-white',
                  ]"
                >
                  عرض العروض ({{ client.offer_orders_count }})
                </button>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/employee/clients/${client.id}/requests`"
                  class="btn-secondary mr-2"
                >
                  طلبات العميل
                </router-link>
                <button
                  class="btn-secondary bg-info mr-2"
                  @click="editClient(client)"
                >
                  تعديل
                </button>
                <button
                  class="bg-red btn-danger mr-2"
                  @click="deleteClient(client.id)"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content p-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ editedClient ? "تعديل العميل" : "إضافة عميل جديد" }}
        </h3>
        <form @submit.prevent="editedClient ? updateClient() : addClient()">
          <input
            v-model="form.companyName"
            placeholder="اسم الشركة"
            class="input-field mb-2"
          />
          <input
            v-model="form.companyAddress"
            placeholder="عنوان الشركة"
            class="input-field mb-2"
          />
          <input
            v-model="form.contactName"
            placeholder="اسم المسئول"
            class="input-field mb-2"
          />
          <input
            v-model="form.mobile"
            placeholder="رقم الجوال"
            class="input-field mb-2"
          />
          <input
            v-model="form.email"
            placeholder="البريد"
            class="input-field mb-2"
          />
          <input
            v-model="form.website"
            placeholder="الموقع الالكتروني"
            class="input-field mb-2"
          />
          <input
            v-model="form.facebook"
            placeholder="فيسبوك"
            class="input-field mb-2"
          />
          <input
            v-model="form.instagram"
            placeholder="انستجرام"
            class="input-field mb-2"
          />
          <input
            v-model="form.photo"
            placeholder="صورة"
            class="input-field mb-2"
          />
          <textarea
            v-model="form.notes"
            placeholder="ملاحظات"
            class="input-field mb-2"
          ></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeModal">
              إلغاء
            </button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- client offers  -->
    <div v-if="showAddOfferModal" class="modal-overlay">
      <div class="modal-content p-4 max-w-6xl h-5/6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            عروض الأسعار - {{order?.first_name}}
          </h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showAddOfferModal = false">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="h-full overflow-y-auto" v-if="order?.offer_orders?.length > 0">
          <div v-for="order in order?.offer_orders" :key="order.id" data-v-438c130a="" class="space-y-6">
            <div data-v-438c130a="" class="flex justify-between items-center">
              <h3
                data-v-438c130a=""
                class="text-lg font-semibold text-gray-900 dark:text-white"
              ></h3>
              <!---->
            </div>
            <div data-v-438c130a="" class="space-y-4">
              <div
                data-v-438c130a=""
                class="relative card p-6 hover:shadow-lg transition-shadow"
              >
                <span data-v-438c130a="" class="price_offer_number">1</span>
                <div
                  data-v-438c130a=""
                  class="flex justify-between items-start mb-4"
                >
                  <div data-v-438c130a="">
                    <h4
                      data-v-438c130a=""
                      class="text-lg font-bold text-yellow-100 dark:text-yellow-500"
                    >
                     {{ order.notes }}
                    </h4>
                    <p
                      data-v-438c130a=""
                      class="text-gray-600 dark:text-gray-400 mt-1"
                    >
                     {{ order.notes }}
                    </p>
                  </div>
                  <div
                    data-v-438c130a=""
                    class="flex items-center space-x-2 space-x-reverse"
                  >
                    <span
                      data-v-438c130a=""
                      class="inline-flex px-2 py-1 text-md font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      >{{ order.status_f }}</span
                    >
                    <div
                      data-v-438c130a=""
                      class="flex items-center space-x-1 space-x-reverse"
                    >
                      <button
                        data-v-438c130a=""
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="حذف"
                      >
                        <i data-v-438c130a="" class="pi pi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  data-v-438c130a=""
                  class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                >
                  <div data-v-438c130a="">
                    <span
                      data-v-438c130a=""
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >المبلغ:</span
                    >
                    <p
                      data-v-438c130a=""
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ order.sub_total }} {{order.payment_method}}
                    </p>
                  </div>
                  <div data-v-438c130a="">
                    <span
                      data-v-438c130a=""
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >التاريخ:</span
                    >
                    <p data-v-438c130a="" class="text-gray-900 dark:text-white">
                     {{ order.order_date_time }}
                    </p>
                  </div>
                  <div data-v-438c130a="">
                    <span
                      data-v-438c130a=""
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >آخر تحديث:</span
                    >
                    <p data-v-438c130a="" class="text-gray-900 dark:text-white">
                      {{ order.order_time }}
                    </p>
                  </div>
                </div>
                <div
                  data-v-438c130a=""
                  class="border-t border-gray-200 dark:border-gray-700 pt-4"
                >
                  <h5
                    data-v-438c130a=""
                    class="text-lg font-bold text-yellow-100 dark:text-yellow-500"
                  >
                    الملفات المرفقة:
                  </h5>
                  <div
                    data-v-438c130a=""
                    class="flex items-center justify-between mb-2"
                  >
                    <div data-v-438c130a="" class="flex items-center">
                      <i
                        data-v-438c130a=""
                        class="pi pi-file-pdf text-red-500 mr-2"
                      ></i
                      ><span
                        data-v-438c130a=""
                        class="text-sm text-gray-600 dark:text-gray-400"
                      >
                        ملف العرض الأصلي:
                      </span>
                    </div>
                    <div
                      data-v-438c130a=""
                      class="flex items-center space-x-2 space-x-reverse"
                    >
                      <span
                        data-v-438c130a=""
                        class="text-sm text-gray-900 dark:text-white"
                        >{{ order.image }}</span
                      ><button
                        data-v-438c130a=""
                        class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        title="تحميل"
                       @click="openFile(order.image)"
                      >
                        <i
                          data-v-438c130a=""
                          class="pi pi-download"
                        ></i></button
                      ><button
                        data-v-438c130a=""
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="عرض"
                          @click="openFile(order.image)"
                      >
                        <i data-v-438c130a="" class="pi pi-eye"></i>
                      </button>
                    </div>
                  </div>
                  <div
                    data-v-438c130a=""
                    class="flex items-center justify-between"
                  >
                    <div data-v-438c130a="" class="flex items-center">
                      <i
                        data-v-438c130a=""
                        class="pi pi-file-pdf text-green-500 mr-2"
                      ></i
                      ><span
                        data-v-438c130a=""
                        class="text-sm text-gray-600 dark:text-gray-400"
                      >
                        ملف العقد :
                      </span>
                    </div>
                    <div
                      data-v-438c130a=""
                      class="flex items-center space-x-2 space-x-reverse"
                    >
                      <span
                        data-v-438c130a=""
                        class="text-sm text-gray-900 dark:text-white"
                        >{{ order.contract }}</span
                      ><button
                        data-v-438c130a=""
                        class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        title="تحميل"
                         @click="openFile(order.contract)"
                      >
                        <i
                          data-v-438c130a=""
                          class="pi pi-download"
                        ></i></button
                      ><button
                        data-v-438c130a=""
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="عرض"
                        @click="openFile(order.contract)"
                      >
                        <i data-v-438c130a="" class="pi pi-eye"></i>
                      </button>
                    </div>
                  </div>
                  <!----><!----><!---->
                </div>
              </div>
              <!---->
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div v-else data-v-438c130a="" class="space-y-4"><div data-v-438c130a="" class="text-center py-12"><i data-v-438c130a="" class="pi pi-file text-red-400 mb-4" style="font-size: 50px;"></i><p data-v-438c130a="" class="text-3xl text-red-500 dark:text-red-400">لا توجد عروض أسعار</p></div></div>
      </div>
    </div>
  </EmployeeLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";
import axios from "axios";
import { on } from "events";

const auth = useEmployeeAuthStore();
const clientsStore = useEmployeeClientsStore();
const showAddModal = ref(false);
const showAddOfferModal = ref(false);
const searchQuery = ref("");
const order = ref(null)
const form = ref({
  companyName: "",
  companyAddress: "",
  contactName: "",
  mobile: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  notes: "",
  photo: "",
});
const myClients = ref([]);
const openFile = (url: string) => {
  if (!url) return;
  window.open(url, "_blank");
};

const filteredClients = computed(() => {
  if (!searchQuery.value) return myClients.value;
  const q = searchQuery.value.toLowerCase();
  return myClients.value.filter(
    (c) =>
      (c.first_name || "").toLowerCase().includes(q) ||
      (c.full_name || "").toLowerCase().includes(q) ||
      (c.phone_info || "").toLowerCase().includes(q)
  );
});

// 🟦 جلب البيانات من الـ API
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const fd = new FormData();
    const response = await axios.post(
      "https://crm.be-kite.com/backend/api/clients",
      fd,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = response.data?.data;
    console.log(response.data?.data);
    myClients.value = response.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

async function addClient() {
  const fd = new FormData();
  fd.append("first_name", form.value.companyName);
  fd.append("full_name", form.value.contactName);
  fd.append("email", form.value.email);
  fd.append("phone_info", form.value.mobile);
  fd.append("email_info", form.value.email);
  fd.append("address", form.value.companyAddress);
  fd.append("web_site", form.value.website);
  fd.append("facebook", form.value.facebook);
  fd.append("instagram", form.value.instagram);
  fd.append("desc", form.value.notes);
  fd.append("photo", form.value.photo);
  fd.append("user_type", "client");
  const response = await axios.post(
    "https://crm.be-kite.com/backend/api/add-client",
    fd,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  console.log(response);
  fetchDashboardData();
  showAddModal.value = false;
  form.value = {
    companyName: "",
    companyAddress: "",
    contactName: "",
    mobile: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    notes: "",
    photo: "",
  };
}
async function deleteClient(clientId: string) {
  const fd = new FormData();
  fd.append("user_id", clientId);
  const response = await axios.post(
    "https://crm.be-kite.com/backend/api/destroy-user",
    fd,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  fetchDashboardData();
  // After editing, you would typically send an update request to the API
  // This part is omitted for brevity
}

const editedClient = ref(null);
const editClient = (client: any) => {
  editedClient.value = client;
  form.value = {
    companyName: client.first_name || "",
    companyAddress: client.address || "",
    contactName: client.full_name || "",
    mobile: client.phone_info || "",
    email: client.email || "",
    website: client.web_site || "",
    facebook: client.facebook || "",
    instagram: client.instagram || "",
    notes: client.desc || "",
    photo: client.photo || "",
  };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editedClient.value = null;
  form.value = {
    companyName: "",
    companyAddress: "",
    contactName: "",
    mobile: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    notes: "",
    photo: "",
  };
};

async function updateClient() {
  const fd = new FormData();
  fd.append("user_id", editedClient.value.id);
  // fd.append("id", editedClient.value.id);
  fd.append("first_name", form.value.companyName);
  fd.append("full_name", form.value.contactName);
  fd.append("email", form.value.email);
  fd.append("phone_info", form.value.mobile);
  fd.append("email_info", form.value.email);
  fd.append("address", form.value.companyAddress);
  fd.append("web_site", form.value.website);
  fd.append("facebook", form.value.facebook);
  fd.append("instagram", form.value.instagram);
  fd.append("desc", form.value.notes);
  fd.append("photo", form.value.photo);
  fd.append("user_type", "client");

  const response = await axios.post(
    "https://crm.be-kite.com/backend/api/update-client",
    fd,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  console.log(response);
  fetchDashboardData();
  closeModal();
}

function getPriceOffersCount(clientId: string) {
  return clientsStore.getPriceOffersByClient(clientId).length;
}

// Inject dummy data for regular clients
if (myClients.value.length === 0) {
  clientsStore.clients.push(
    {
      id: "reg1",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة التطوير المتقدم",
      companyAddress: "الرياض، شارع الملك عبدالله",
      contactName: "علي محمد",
      mobile: "0504444444",
      email: "ali@advanced-dev.com",
      website: "https://advanced-dev.com",
      facebook: "advanceddev",
      instagram: "advanced_dev",
      notes: "عميل عادي - مشاريع تطوير",
      status: "regular",
    },
    {
      id: "reg2",
      employeeId: auth.employee?.id || "emp1",
      companyName: "مؤسسة الحلول الذكية",
      companyAddress: "جدة، شارع التحلية",
      contactName: "نورا أحمد",
      mobile: "0555555555",
      email: "nora@smart-solutions.com",
      website: "https://smart-solutions.com",
      facebook: "smartsolutions",
      instagram: "smart_solutions",
      notes: "عميل عادي - حلول ذكية",
      status: "regular",
    },
    {
      id: "reg3",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة التقنية الحديثة",
      companyAddress: "الدمام، شارع الملك خالد",
      contactName: "حسن علي",
      mobile: "0536666666",
      email: "hassan@modern-tech.com",
      website: "https://modern-tech.com",
      facebook: "moderntech",
      instagram: "modern_tech",
      notes: "عميل عادي - تقنيات حديثة",
      status: "regular",
    }
  );
}

onMounted(() => {
  fetchDashboardData();
});
</script>
<style>
.bg-green {
  background-color: #28a745 !important;
}
.bg-red {
  background-color: #dc3545 !important  ;
}
.bg-info {
  background-color: #17a2b8 !important;
}
td:not(:last-child) {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price_offer_number[data-v-438c130a] {
    position: absolute;
    right: 50%;
    top: -25px;
    display: flex
;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    width: 50px;
    height: 50px;
    background: #154d9b;
    color: #fff;
    font-weight: 700;
    border-radius: 50%;
}
</style>