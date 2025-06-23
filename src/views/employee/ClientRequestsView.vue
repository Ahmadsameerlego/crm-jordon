<template>
  <EmployeeLayout>
    <template #title>طلبات العميل</template>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">طلبات العميل</h2>
      <div class="flex items-center space-x-4">
        <button class="btn-primary mx-3" @click="showVisit = true">
          <i class="pi pi-plus mr-2"></i> إضافة زيارة
        </button>
        <button class="btn-primary " @click="showReq = true">
          <i class="pi pi-plus mr-2"></i> إضافة متطلب
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Visits Table -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">الزيارات</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  التاريخ والوقت
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="visit in visits" :key="visit.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ visit.dateTime }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="btn-secondary mr-2" @click="editVisit(visit)">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="btn-primary" @click="deleteVisit(visit)">
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Requirements Table -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">المتطلبات</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الخدمة
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الوصف
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="req in requirements" :key="req.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ getServiceName(req.service) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ req.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
    <!-- Add/Edit Visit Modal -->
    <div v-if="showVisit" class="modal-overlay">
      <div class="modal-content p-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingVisit ? "تعديل زيارة" : "إضافة زيارة" }}
        </h3>
        <form @submit.prevent="editingVisit ? updateVisit() : addVisit()">
          <input v-model="visitForm.dateTime" type="datetime-local" class="input-field mb-2" />
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeVisitModal">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Add/Edit Requirement Modal -->
    <div v-if="showReq" class="modal-overlay">
      <div class="modal-content p-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingReq ? "تعديل متطلب" : "إضافة متطلب" }}</h3>
        <form @submit.prevent="editingReq ? updateReq() : addRequirement()">
          <select v-model="reqForm.service" class="input-field mb-2">
            <option value="" disabled>اختر الخدمة</option>
            <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <textarea
            v-model="reqForm.description"
            placeholder="وصف الطلب"
            class="input-field mb-2"
          ></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="closeReqModal">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  </EmployeeLayout>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useEmployeeVisitsStore } from "@/stores/employeeVisits";
import { useEmployeeRequirementsStore } from "@/stores/employeeRequirements";
import { useServicesStore } from "@/stores/services";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";

const route = useRoute();
const clientId = route.params.clientId as string;
const visitsStore = useEmployeeVisitsStore();
const reqsStore = useEmployeeRequirementsStore();
const servicesStore = useServicesStore();

const showVisit = ref(false);
const showReq = ref(false);
const editingVisit = ref(null as null | any);
const editingReq = ref(null as null | any);
const visitForm = ref({ dateTime: "" });
const reqForm = ref({ service: "", description: "" });

const visits = computed(() => visitsStore.getVisitsByClient(clientId));
const requirements = computed(() => reqsStore.getRequirementsByClient(clientId));
const services = computed(() => servicesStore.services);

function addVisit() {
  visitsStore.addVisit({ ...visitForm.value, clientId });
  closeVisitModal();
}
function editVisit(visit: any) {
  editingVisit.value = visit;
  visitForm.value.dateTime = visit.dateTime;
  showVisit.value = true;
}
function updateVisit() {
  if (editingVisit.value) {
    visitsStore.updateVisit({ ...editingVisit.value, ...visitForm.value });
    closeVisitModal();
  }
}
function deleteVisit(visit: any) {
  visitsStore.deleteVisit(visit.id);
}
function closeVisitModal() {
  showVisit.value = false;
  editingVisit.value = null;
  visitForm.value.dateTime = "";
}
function addRequirement() {
  reqsStore.addRequirement({ ...reqForm.value, clientId });
  closeReqModal();
}
function editReq(req: any) {
  editingReq.value = req;
  reqForm.value.service = req.service;
  reqForm.value.description = req.description;
  showReq.value = true;
}
function updateReq() {
  if (editingReq.value) {
    reqsStore.updateRequirement({ ...editingReq.value, ...reqForm.value });
    closeReqModal();
  }
}
function deleteReq(req: any) {
  reqsStore.deleteRequirement(req.id);
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
</script>
