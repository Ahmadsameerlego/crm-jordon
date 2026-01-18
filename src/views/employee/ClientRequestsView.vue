<template>
  <EmployeeLayout>
    <template #title>طلبات العميل</template>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">طلبات العميل</h2>
      <div class="flex items-center space-x-4 space-x-reverse">
        <button class="btn-primary mx-3" @click="showVisit = true">
          <i class="pi pi-plus mr-2"></i> إضافة زيارة
        </button>
        <button class="btn-primary mx-3" @click="showFollowUp = true">
          <i class="pi pi-plus mr-2"></i> إضافة متابعة
        </button>
        <button class="btn-primary" @click="showReq = true">
          <i class="pi pi-plus mr-2"></i> إضافة متطلب
        </button>
      </div>
    </div>

    <!-- Three Tables Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Visits Table -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4 text-primary-600">الزيارات</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  التاريخ والوقت
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  التقرير
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="visit in visits" :key="visit.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ visit.date_time }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  <span v-if="visit.notes" class="text-green-600">✓ تم التقرير</span>
                  <span v-else class="text-red-600">✗ بدون تقرير</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="!visit.notes"
                    class="btn-secondary mr-2"
                    @click="openVisitReport(visit)"
                  >
                    <i class="pi pi-file-edit"></i>
                  </button>
                  <button v-else class="btn-secondary mr-2" @click="viewVisitReport(visit)">
                    <i class="pi pi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Follow-ups Table -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4 text-blue-600">المتابعات</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  النوع
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  التاريخ
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="followUp in followUps" :key="followUp.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span :class="getFollowUpTypeClass(followUp.service_title_ar)">
                    {{ getFollowUpTypeText(followUp.service_title_ar) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ followUp.date_time }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button class="btn-secondary mr-2" @click="viewFollowUp(followUp)">
                    <i class="pi pi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Requirements Table -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4 text-green-600">المتطلبات</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الخدمة
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الوصف
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="req in requirements" :key="req.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ req.service_title_ar }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ req.notes }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button class="btn-secondary mr-2" @click="editReq(req)">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="btn-primary" @click="deleteReq(req)">
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Visit Modal -->
    <div v-if="showVisit" class="modal-overlay">
      <div class="modal-content p-4" style="max-width:400px">
        <h3 class="text-lg font-semibold mb-4">إضافة زيارة</h3>
        <form @submit.prevent="addVisit()">
          <input
            v-model="visitForm.dateTime"
            type="datetime-local"
            class="input-field mb-2"
            required
          />
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeVisitModal">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Visit Report Modal -->
    <div v-if="showVisitReport" class="modal-overlay">
      <div class="modal-content p-4 max-w-2xl" style="max-width: 500px;">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingVisitReport ? "تعديل تقرير الزيارة" : "إضافة تقرير الزيارة" }}
        </h3>
        <form @submit.prevent="saveVisitReport()">
          <textarea
            v-model="visitReportForm.report"
            placeholder="اكتب تفاصيل تقرير الزيارة..."
            class="input-field mb-2 h-32"
            required
          ></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeVisitReportModal">
              إلغاء
            </button>
            <button type="submit" class="btn-primary">حفظ التقرير</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Follow-up Modal -->
    <div v-if="showFollowUp" class="modal-overlay">
      <div class="modal-content p-4" style="max-width:400px">
        <h3 class="text-lg font-semibold mb-4">إضافة متابعة</h3>
        <form @submit.prevent="addFollowUp()">
          <select v-model="followUpForm.type" class="input-field mb-2" required>
            <option value="">اختر نوع المتابعة</option>
            <option value="external">زيارة خارجية</option>
            <option value="internal">زيارة داخلية</option>
            <option value="phone">مكالمة هاتفية</option>
          </select>
          <input
            v-model="followUpForm.dateTime"
            type="datetime-local"
            class="input-field mb-2"
            required
          />
          <textarea
            v-model="followUpForm.description"
            placeholder="تفاصيل المتابعة..."
            class="input-field mb-2 h-24"
            required
          ></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeFollowUpModal">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Requirement Modal -->
    <div v-if="showReq" class="modal-overlay">
      <div class="modal-content p-4" style="max-width:400px">
        <h3 class="text-lg font-semibold mb-4">{{ editingReq ? "تعديل متطلب" : "إضافة متطلب" }}</h3>
        <form @submit.prevent="editingReq ? updateReq() : addRequirement()">
          <select v-model="reqForm.service" class="input-field mb-2" required>
            <option value="" disabled>اختر الخدمة</option>
            <option v-for="s in services" :key="s.id" :value="s.label">{{ s.label }}</option>
          </select>
          <textarea
            v-model="reqForm.description"
            placeholder="وصف الطلب"
            class="input-field mb-2"
            required
          ></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeReqModal">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Follow-up Details Modal -->
    <div v-if="showFollowUpDetails" class="modal-overlay">
      <div class="modal-content p-4 max-w-lg" style="max-width: 500px;">
        <h3 class="text-lg font-semibold mb-4">تفاصيل المتابعة</h3>
        <div class="mb-4">
          <strong>النوع:</strong> {{ getFollowUpTypeText(selectedFollowUp?.service_title_ar || "") }}<br />
          <strong>التاريخ والوقت:</strong> {{ selectedFollowUp?.date_time || ""}}<br />
          <strong>التفاصيل:</strong><br />
          <p class="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            {{ selectedFollowUp?.notes }}
          </p>
        </div>
        <div class="flex justify-end">
          <button class="btn-secondary" @click="showFollowUpDetails = false">إغلاق</button>
        </div>
      </div>
    </div>
  </EmployeeLayout>
</template>

<script setup lang="ts">
import { ref, computed , onMounted} from "vue";
import { useRoute } from "vue-router";
import { useEmployeeVisitsStore } from "@/stores/employeeVisits";
import { useEmployeeRequirementsStore } from "@/stores/employeeRequirements";
import { useServicesStore } from "@/stores/services";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";
import type { Visit, FollowUp } from "@/types/visit";
import axios from "axios";
const route = useRoute();
const clientId = route.params.clientId as string;
const visitsStore = useEmployeeVisitsStore();
const reqsStore = useEmployeeRequirementsStore();
const servicesStore = useServicesStore();

const showVisit = ref(false);
const showFollowUp = ref(false);
const showReq = ref(false);
const showVisitReport = ref(false);
const showFollowUpDetails = ref(false);

const editingReq = ref(null as null | any);
const editingVisitReport = ref(null as null | Visit);
const selectedFollowUp = ref<FollowUp | null>(null);

const visitForm = ref({ dateTime: "" });
const followUpForm = ref({ type: "", dateTime: "", description: "" });
const reqForm = ref({ service: "", description: "" });
const visitReportForm = ref({ report: "" });
const services = ref([
  {
    id : 1 ,
    label : 'تصميم موقع إلكتروني تعريفي'
  },
  {
    id : 2 ,
    label : 'تصميم موقع تجاره الكتروني'
  },
  {
    id : 3,
    label : 'تصميم تطبيق هاتف'
  },
  // {
  //   id : 4 ,
  //   label : 'نظام erp'
  // },
  {
    id : 5 ,
    label : 'نظام erp'
  },
  {
    id : 6 ,
    label : 'خدمه استضافه'
  },
  {
    id : 7 ,
    label : 'اداره مواقع التواصل الاجتماعي والحملات الاعلانيه'
  },
  {
    id : 8 ,
    label : 'خدمه التصوير الفوتوغرافي والفيديو'
  },
  {
    id : 9,
    label : 'خدمه تصميم الهويه البصريه'
  },
  {
    id : 10,
    label : 'خدمه تصميم فيديوهات الموشن والمونتاج'
  },
])

function formatDateTime(dateTime: string) {
  return new Date(dateTime).toLocaleString("ar-SA");
}

function getFollowUpTypeText(type: string) {
  const types = {
    external: "زيارة خارجية",
    internal: "زيارة داخلية",
    phone: "مكالمة هاتفية",
  };
  return types[type as keyof typeof types] || type;
}

function getFollowUpTypeClass(type: string) {
  const classes = {
    external: "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs",
    internal: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs",
    phone: "bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs",
  };
  return classes[type as keyof typeof classes] || "";
}

async function addVisit() {
  const fd = new FormData();
  fd.append('date', visitForm.value.dateTime)
  fd.append('type', 'visit')
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/store-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
  closeVisitModal();
}

function closeVisitModal() {
  showVisit.value = false;
  visitForm.value.dateTime = "";
}
const order_id = ref('')
function openVisitReport(visit: Visit) {
  order_id.value = visit.id ;
  editingVisitReport.value = visit;
  visitReportForm.value.report = visit.report || "";
  showVisitReport.value = true;
}

function viewVisitReport(visit: Visit) {
  editingVisitReport.value = visit;
  visitReportForm.value.report = visit.notes || "";
  showVisitReport.value = true;
}

async function saveVisitReport() {
const fd = new FormData();
  fd.append('notes', visitReportForm.value.report)
  fd.append('order_id', order_id.value)
  fd.append('type', 'visit')
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/update-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
  closeVisitReportModal()
}

function closeVisitReportModal() {
  showVisitReport.value = false;
  editingVisitReport.value = null;
  visitReportForm.value.report = "";
}

async function addFollowUp() {

  const fd = new FormData();
  fd.append('service_title_ar', followUpForm.value.type)
  fd.append('notes', followUpForm.value.description)
  fd.append('date', followUpForm.value.dateTime)
  fd.append('type', 'follow')
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/store-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
  closeFollowUpModal();
}

function closeFollowUpModal() {
  showFollowUp.value = false;
  followUpForm.value = { type: "", dateTime: "", description: "" };
}

function viewFollowUp(followUp: FollowUp) {
  selectedFollowUp.value = followUp;
  showFollowUpDetails.value = true;
}

async function addRequirement() {
  // reqsStore.addRequirement({ ...reqForm.value, clientId });
  const fd = new FormData();
  fd.append('service_title_ar', reqForm.value.service)
  fd.append('notes', reqForm.value.description)
  // fd.append('order_id', order_id.value)
  fd.append('type', 'require')
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/store-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
  
  closeReqModal();
}
const req_id = ref('') ;
function editReq(req: any) {
  editingReq.value = req;
  reqForm.value.service = req.service_title_ar;
  reqForm.value.description = req.notes;
  req_id.value = req.id ;
  showReq.value = true;
}

async function updateReq() {
  if (editingReq.value) {
    // reqsStore.updateRequirement({ ...editingReq.value, ...reqForm.value });
     // reqsStore.addRequirement({ ...reqForm.value, clientId });
  const fd = new FormData();
  fd.append('service_title_ar', reqForm.value.service)
  fd.append('notes', reqForm.value.description)
  fd.append('order_id', req_id.value)
  fd.append('type', 'require')
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/update-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
    closeReqModal();
  }
}

async function deleteReq(req: any) {
   const fd = new FormData();
  fd.append('order_id', req.id)
  fd.append('provider_id', route.params.clientId)
  await axios.post('https://crm.be-kite.com/backend/api/delete-order', fd , {
    headers:{
      Authorization : localStorage.getItem('token')
    }
  })
  fetchOrders();
  // reqsStore.deleteRequirement(req.id);
}

function closeReqModal() {
  showReq.value = false;
  editingReq.value = null;
  reqForm.value.service = "";
  reqForm.value.description = "";
}

function getServiceName(id: string) {
  return services.value.find((s) => s.id === id)?.name || "";
}

const allOrders = ref([])
const fetchOrders = async () => {
  try {
    const { data } = await axios.post(
      "https://crm.be-kite.com/backend/api/show-all-orders" ,{},
      {
        headers:{
          Authorization : localStorage.getItem('token')
        }
      }
    );
    if (data && data.data) {
      allOrders.value = data.data;
    }
  } catch (err) {
    console.error(err)
  } 
};

// computed filters
const visits = computed(() =>
  allOrders.value.filter((o) => o.type === "visit")
);
const followUps = computed(() =>
  allOrders.value.filter((o) => o.type === "follow")
);
const requirements = computed(() =>
  allOrders.value.filter((o) => o.type === "require")
);

onMounted(fetchOrders);


</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow p-4;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  color: #222;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 320px;
  max-width: 100vw;
}
.dark .modal-content {
  background: #23272f;
  color: #f3f4f6;
}
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100;
}
</style>
